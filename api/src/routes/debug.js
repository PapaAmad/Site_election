const express = require("express");
const { db } = require("../database/init");

const router = express.Router();

// Debug endpoint to check users in database
router.get("/users", (req, res) => {
  db.all(
    "SELECT id, email, first_name, last_name, role, status, created_at FROM users ORDER BY created_at DESC",
    [],
    (err, users) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Erreur serveur" });
      }

      res.json({
        total: users.length,
        users: users.map((user) => ({
          id: user.id,
          email: user.email,
          name: `${user.first_name} ${user.last_name}`,
          role: user.role,
          status: user.status,
          created_at: user.created_at,
        })),
      });
    },
  );
});

// Debug endpoint to check specific user
router.get("/user/:email", (req, res) => {
  const { email } = req.params;

  db.get(
    "SELECT id, email, first_name, last_name, role, status, created_at FROM users WHERE email = ?",
    [email],
    (err, user) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Erreur serveur" });
      }

      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }

      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: `${user.first_name} ${user.last_name}`,
          role: user.role,
          status: user.status,
          created_at: user.created_at,
        },
      });
    },
  );
});

module.exports = router;
