const User = require("../../models/User");
const Admin = require("../../models/Admin");
const UserWorkHistory = require("../../models/UserWorkHistory");
const UserDependence = require("../../models/UserDependence");
const UserDisability = require("../../models/UserDisability");
const UserDisease = require("../../models/UserDisease");
const UserMedicalCondition = require("../../models/UserMedicalCondition");

// Get All Pending Users
const getPendingUsers = async (req, res) => {
  try {
    const admin = await Admin.findOne(); // Get admin's workplace
    const adminWorkplace = admin ? admin.workplace : null; // Assign workplace

    if (!adminWorkplace) {
      return res.status(400).json({ message: "Admin workplace not found" });
    }

    const pendingUsers = await User.find({
      isSubmited: true,
      isChecked: false,
      isRecommended: false,
      isRejected: false,
      isApproved: false,
      workplace: { $eq: adminWorkplace, $ne: null }, // Match users' workplace
    });

    res.status(200).json(pendingUsers);
  } catch (error) {
    console.error("Error fetching pending users:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

//Get All Rejected Users
const getRejectedUsers = async (req, res) => {
  try {
    const rejectedUsers = await User.find({
      isSubmited: false,
      isChecked: false,
      isRecommended: false,
      isRejected: true,
      isApproved: false,
    });
    res.status(200).json(rejectedUsers);
  } catch (error) {
    console.error("Error fetching pending users:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Checked Users
const getCheckedUsers = async (req, res) => {
  try {
    const checkedusers = await User.find({
      isSubmited: true,
      isChecked: true,
      isRecommended: false,
      isRejected: false,
      isApproved: false,
    });
    res.status(200).json(checkedusers);
  } catch (error) {
    console.error("Error fetching pending users:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Recommeded Users
const getRecommendedUsers = async (req, res) => {
  try {
    const recommendedusers = await User.find({
      isSubmited: true,
      isChecked: true,
      isRecommended: true,
      isRejected: false,
      isApproved: false,
    });
    res.status(200).json(recommendedusers);
  } catch (error) {
    console.error("Error fetching pending users:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Approved Users
const getApprovedUsers = async (req, res) => {
  try {
    const approvedUsers = await User.find({
      isSubmited: true,
      isChecked: true,
      isRecommended: true,
      isRejected: false,
      isApproved: true,
    });
    res.status(200).json(approvedUsers);
  } catch (error) {
    console.error("Error fetching pending users:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// check User User
const checkUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isSubmited = true;
    user.isChecked = true; // check User
    user.isRecommended = false;
    user.isApproved = false;
    user.isRejected = false;
    await user.save();

    res.status(200).json({ message: "User checked successfully" });
  } catch (error) {
    console.error("Approval Error:", error.message);
    res
      .status(500)
      .json({ error: "Cannot check the user right now. try again" });
  }
};

// Approve User
const recommendUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isSubmited = true;
    user.isChecked = true;
    user.isRecommended = true; // Recommended User
    user.isApproved = false;
    user.isRejected = false;
    await user.save();

    res.status(200).json({ message: "User recommended successfully" });
  } catch (error) {
    console.error("Approval Error:", error.message);
    res
      .status(500)
      .json({ error: "Cannot recommend the user right now. try again" });
  }
};

// Approve User
const approveUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isSubmited = true;
    user.isChecked = true;
    user.isRecommended = true;
    user.isApproved = true; // Approve user
    user.isRejected = false;
    user.progressValue += 10; // Add 10 progress value to the existing progressValue

    await user.save();

    res.status(200).json({ message: "User approved successfully" });
  } catch (error) {
    console.error("Approval Error:", error.message);
    res
      .status(500)
      .json({ error: "Cannot approve the user right now. try again" });
  }
};

// Reject User (Delete User)
const rejectUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        isSubmited: false,
        isChecked: false,
        isRecommended: false,
        isApproved: false,
        isRejected: true,
      },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete related records except in the Users collection
    await Promise.all([
      UserWorkHistory.deleteMany({ userId }),
      UserDependence.deleteMany({ userId }),
      UserDisability.deleteMany({ userId }), // Add other related collections here
      UserDisease.deleteMany({ userId }), // Add other related collections here
      UserMedicalCondition.deleteMany({ userId }), // Add other related collections here
    ]);

    res
      .status(200)
      .json({ message: "User rejected and related records deleted" });
  } catch (error) {
    console.error("Rejection Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getRejectedUsers,
  getPendingUsers,
  getCheckedUsers,
  getRecommendedUsers,
  getApprovedUsers,
  checkUser,
  recommendUser,
  approveUser,
  rejectUser,
};
