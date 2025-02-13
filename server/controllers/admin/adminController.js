const User = require("../../models/User");
const Admin = require("../../models/Admin");

// Get All Pending Users
const getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await User.find({
      isSubmited: true,
      isChecked: false,
      isRecommended: false,
      isRejected: false,
      isApproved: false,
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

    user.isChecked = true; // check User
    user.isRejected = false; // Rejected User
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

    user.isRecommended = true; // recommend User user
    user.isRejected = false; // Rejected User
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

    user.isApproved = true; // Approve user
    user.isRejected = false; // Rejected User
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
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isSubmited = false;
    user.isRejected = true;
    user.isChecked = false;
    user.isRecommended = false;
    user.isApproved = false;
    await user.save();

    res.status(200).json({ message: "User rejected successfully" });
  } catch (error) {
    console.error("Approval Error:", error.message);
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
