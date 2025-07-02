const { body, validationResult } = require("express-validator");
const { db } = require("../database/init");

// Get all voters and candidates
const getVoters = (req, res) => {
  db.all(
    "SELECT id, email, first_name, last_name, role, status, created_at, last_login FROM users WHERE role IN ('voter', 'candidate') ORDER BY created_at DESC",
    [],
    (err, users) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Erreur serveur" });
      }

      res.json({ users });
    },
  );
};

// Get all users (admin only)
const getAllUsers = (req, res) => {
  db.all(
    "SELECT id, email, first_name, last_name, role, status, created_at, last_login FROM users ORDER BY created_at DESC",
    [],
    (err, users) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Erreur serveur" });
      }

      res.json({ users });
    },
  );
};

// Update user status
const updateUserStatus = (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;

  // Validate status
  const validStatuses = ["pending", "approved", "rejected", "blocked"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Statut invalide" });
  }

  db.run(
    "UPDATE users SET status = ?, updated_at = ? WHERE id = ?",
    [status, new Date().toISOString(), userId],
    function (err) {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Erreur serveur" });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }

      res.json({
        message: "Statut utilisateur mis à jour",
        userId,
        newStatus: status,
      });
    },
  );
};

// Get user statistics
const getUserStats = (req, res) => {
  const queries = [
    "SELECT COUNT(*) as total FROM users WHERE role IN ('voter', 'candidate')",
    "SELECT COUNT(*) as pending FROM users WHERE role IN ('voter', 'candidate') AND status = 'pending'",
    "SELECT COUNT(*) as approved FROM users WHERE role IN ('voter', 'candidate') AND status = 'approved'",
    "SELECT COUNT(*) as rejected FROM users WHERE role IN ('voter', 'candidate') AND status = 'rejected'",
    "SELECT COUNT(*) as blocked FROM users WHERE role IN ('voter', 'candidate') AND status = 'blocked'",
    "SELECT COUNT(*) as active FROM users WHERE role IN ('voter', 'candidate') AND status = 'approved' AND last_login IS NOT NULL",
  ];

  const stats = {};
  let completed = 0;

  queries.forEach((query, index) => {
    db.get(query, [], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Erreur serveur" });
      }

      const keys = [
        "total",
        "pending",
        "approved",
        "rejected",
        "blocked",
        "active",
      ];
      stats[keys[index]] = result[keys[index]];

      completed++;
      if (completed === queries.length) {
        res.json({ stats });
      }
    });
  });
};

// Delete user (admin only, with restrictions)
const deleteUser = (req, res) => {
  const { userId } = req.params;

  // Prevent admin from deleting themselves
  if (userId === req.user.id) {
    return res
      .status(400)
      .json({ error: "Impossible de supprimer votre propre compte" });
  }

  // Check if user exists and is not an admin
  db.get("SELECT role FROM users WHERE id = ?", [userId], (err, user) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    if (user.role === "admin") {
      return res
        .status(400)
        .json({ error: "Impossible de supprimer un administrateur" });
    }

    // Delete user
    db.run("DELETE FROM users WHERE id = ?", [userId], function (err) {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Erreur serveur" });
      }

      res.json({
        message: "Utilisateur supprimé",
        userId,
      });
    });
  });
};

module.exports = {
  getVoters,
  getAllUsers,
  updateUserStatus,
  getUserStats,
  deleteUser,
};
