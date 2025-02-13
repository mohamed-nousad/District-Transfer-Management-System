const express = require("express");
const router = express.Router();

// Importing the necessary middleware and controller functions
const { validateRegistration } = require("../middleware/user/validateRegister");
const {
  registerUser,
  loginUser,
} = require("../controllers/user/auth/authController"); // Added loginUser
const { validateLogin } = require("../middleware/user/validateLogin");
const { loginRateLimiter } = require("../middleware/user/rateLimiter");

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", validateRegistration, registerUser);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", loginRateLimiter, validateLogin, loginUser); // Added loginUser here

module.exports = router;
