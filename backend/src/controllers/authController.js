const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const { db } = require("../database/init");

// Validation rules
const loginValidation = [
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 1 }),
  body("role").isIn(["admin", "candidate", "voter", "spectator"]),
];

const registerValidation = [
  body("email").isEmail().normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moins 6 caractères"),
  body("firstName").isLength({ min: 1 }).trim(),
  body("lastName").isLength({ min: 1 }).trim(),
  body("role").isIn(["candidate", "voter", "spectator"]),
];

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );
};

// Login controller - DEBUGGED VERSION
const login = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("❌ Validation errors:", errors.array());
      return res.status(400).json({
        error: "Données invalides",
        details: errors.array(),
      });
    }

    const { email, password, role } = req.body;
    console.log(`🔍 Login attempt - Email: ${email}, Role: ${role}`);

    // Find user in database
    db.get(
      "SELECT * FROM users WHERE email = ? AND role = ?",
      [email, role],
      async (err, user) => {
        if (err) {
          console.error("❌ Database error:", err);
          return res.status(500).json({ error: "Erreur serveur" });
        }

        console.log(
          `🔍 User found:`,
          user
            ? `ID: ${user.id}, Status: ${user.status}, Role: ${user.role}`
            : "No user found",
        );

        if (!user) {
          // Check if user exists with different role for debugging
          db.get(
            "SELECT email, role, status FROM users WHERE email = ?",
            [email],
            (err2, userCheck) => {
              if (userCheck) {
                console.log(
                  `⚠️ User exists but with different role - Email: ${userCheck.email}, Actual Role: ${userCheck.role}, Status: ${userCheck.status}, Requested Role: ${role}`,
                );
              } else {
                console.log(`❌ No user found with email: ${email}`);
              }
            },
          );
          return res.status(401).json({ error: "Identifiants incorrects" });
        }

        // FIXED: Check account status properly
        console.log(`🔍 Checking user status: ${user.status}`);

        if (user.status === "pending") {
          console.log(`⏳ Account pending for: ${user.email}`);
          return res.status(403).json({
            error: "Compte en attente de validation par un administrateur",
          });
        }
        if (user.status === "rejected") {
          console.log(`❌ Account rejected for: ${user.email}`);
          return res.status(403).json({
            error: "Compte rejeté. Contactez un administrateur.",
          });
        }
        if (user.status === "blocked") {
          console.log(`🚫 Account blocked for: ${user.email}`);
          return res.status(403).json({
            error: "Compte bloqué. Contactez un administrateur.",
          });
        }

        // Verify password
        console.log(`🔍 Checking password for user ${user.email}`);
        const isValidPassword = await bcrypt.compare(
          password,
          user.password_hash,
        );
        console.log(`🔍 Password valid: ${isValidPassword}`);

        if (!isValidPassword) {
          console.log(`❌ Invalid password for user: ${user.email}`);
          return res.status(401).json({ error: "Identifiants incorrects" });
        }

        console.log(`✅ Login successful for: ${user.email} (${user.role})`);

        // Update last login
        db.run("UPDATE users SET last_login = ? WHERE id = ?", [
          new Date().toISOString(),
          user.id,
        ]);

        // Generate token
        const token = generateToken(user);

        // Return user data (without password)
        const { password_hash, ...userWithoutPassword } = user;

        res.json({
          user: userWithoutPassword,
          token,
        });
      },
    );
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Register controller
const register = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("❌ Registration validation errors:", errors.array());
      return res.status(400).json({
        error: "Données invalides",
        details: errors.array(),
      });
    }

    const { email, password, firstName, lastName, role } = req.body;
    console.log(
      `🔍 Registration attempt - Email: ${email}, Role: ${role}, Name: ${firstName} ${lastName}`,
    );

    // Check if email already exists
    db.get(
      "SELECT id FROM users WHERE email = ?",
      [email],
      async (err, existingUser) => {
        if (err) {
          console.error("❌ Database error:", err);
          return res.status(500).json({ error: "Erreur serveur" });
        }

        if (existingUser) {
          console.log(`⚠️ Email already exists: ${email}`);
          return res
            .status(400)
            .json({ error: "Cette adresse email est déjà utilisée" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Generate user ID
        const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        console.log(
          `🔍 Creating user - ID: ${userId}, Email: ${email}, Role: ${role}`,
        );

        // Insert new user
        db.run(
          `INSERT INTO users (id, email, password_hash, first_name, last_name, role, status, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            userId,
            email,
            hashedPassword,
            firstName,
            lastName,
            role,
            role === "admin" ? "approved" : "pending",
            new Date().toISOString(),
          ],
          function (err) {
            if (err) {
              console.error("❌ Database error during registration:", err);
              return res
                .status(500)
                .json({ error: "Erreur lors de l'inscription" });
            }

            console.log(
              `✅ User registered successfully - ID: ${userId}, Email: ${email}`,
            );

            res.status(201).json({
              message:
                "Inscription réussie ! Votre compte sera validé par un administrateur.",
              userId: userId,
            });
          },
        );
      },
    );
  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Get current user
const getCurrentUser = (req, res) => {
  db.get(
    "SELECT id, email, first_name, last_name, role, status, created_at, last_login FROM users WHERE id = ?",
    [req.user.id],
    (err, user) => {
      if (err) {
        console.error("❌ Database error:", err);
        return res.status(500).json({ error: "Erreur serveur" });
      }

      if (!user) {
        console.log(`❌ User not found: ${req.user.id}`);
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }

      res.json({ user });
    },
  );
};

module.exports = {
  login,
  register,
  getCurrentUser,
  loginValidation,
  registerValidation,
};
