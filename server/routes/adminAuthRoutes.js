const express = require("express");
const router = express.Router();
const adminAuthController = require("../controllers/admin/adminAuthController");

// Route for admin register
router.post("/register", adminAuthController.registerAdmin);

// Route for admin login
router.post("/login" ,adminAuthController.loginAdmin);

module.exports = router;
