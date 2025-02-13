const express = require("express");

const router = express.Router();
const adminController = require("../controllers/admin/adminController");

// Get Routes
router.get("/pending-users", adminController.getPendingUsers);

router.get("/rejected-users", adminController.getRejectedUsers);

router.get("/checked-users", adminController.getCheckedUsers);

router.get("/recommended-users", adminController.getRecommendedUsers);

router.get("/approved-users", adminController.getApprovedUsers);

// Update Routes

router.put("/check/:userId", adminController.checkUser);

router.put("/recommend/:userId", adminController.recommendUser);

router.put("/approve/:userId", adminController.approveUser);

router.put("/reject/:userId", adminController.rejectUser);

module.exports = router;
