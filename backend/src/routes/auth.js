const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const {
  login,
  register,
  getCurrentUser,
  loginValidation,
  registerValidation,
} = require("../controllers/authController");

// Public routes
router.post("/login", loginValidation, login);
router.post("/register", registerValidation, register);

// Protected routes
router.get("/me", authenticateToken, getCurrentUser);

module.exports = router;
