const express = require("express");
const {
  register,
  login,
  getMe,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const {
  registerValidationRules,
  loginValidationRules,
  handleValidationErrors,
} = require("../middleware/validationMiddleware");

const router = express.Router();

// Apply validation rules before the controller action
router.post("/register", registerValidationRules(), handleValidationErrors, register);
router.post("/login", loginValidationRules(), handleValidationErrors, login);

// No validation needed for /me as it relies on the token
router.get("/me", protect, getMe);

module.exports = router;

