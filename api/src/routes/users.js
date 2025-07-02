const express = require("express");
const router = express.Router();
const {
  authenticateToken,
  requireRole,
  requireStatus,
} = require("../middleware/auth");
const {
  getVoters,
  getAllUsers,
  updateUserStatus,
  getUserStats,
  deleteUser,
} = require("../controllers/usersController");

// All routes require authentication
router.use(authenticateToken);
router.use(requireStatus(["approved"]));

// Admin only routes
router.get("/voters", requireRole(["admin"]), getVoters);
router.get("/all", requireRole(["admin"]), getAllUsers);
router.get("/stats", requireRole(["admin"]), getUserStats);
router.put("/:userId/status", requireRole(["admin"]), updateUserStatus);
router.delete("/:userId", requireRole(["admin"]), deleteUser);

module.exports = router;
