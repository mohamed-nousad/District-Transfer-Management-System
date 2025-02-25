const express = require("express");
const router = express.Router();

// Importing the necessary middleware and controller functions
const { validateRegistration } = require("../middleware/user/validateRegister");
const { validateLogin } = require("../middleware/user/validateLogin");
const { loginRateLimiter } = require("../middleware/user/rateLimiter");

const { registerUser, loginUser } = require("../controllers/user/auth/authController"); 
const { changePassword } = require("../controllers/user/auth/changePassword"); // Import change password function

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", validateRegistration, registerUser);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", loginRateLimiter, validateLogin, loginUser);

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private (User must be authenticated)
router.put("/change-password", changePassword);

module.exports = router;
