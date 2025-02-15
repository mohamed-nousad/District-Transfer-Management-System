const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const UserDependence = require("../../models//UserDependence");
const UserDisability = require("../../models/UserDisability");
const UserMedicalCondition = require("../../models/UserMedicalCondition");
const UserWorkHistory = require("../../models/UserWorkHistory");
const UserDisease = require("../../models/UserDisease");

exports.validateUser = [
  check("id")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid User ID")
    .custom(async (value) => {
      const user = await User.findById(value);
      if (!user) {
        throw new Error("User not found");
      }
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation rules for the update
exports.validateUserUpdate = [
  check("first_appointment_date")
    .notEmpty()
    .withMessage("First appointment date is required"),
  check("duty_assumed_date")
    .notEmpty()
    .withMessage("Duty assumed date is required"),
  check("workplace").notEmpty().withMessage("Workplace is required"),
  check("designation").notEmpty().withMessage("Designation is required"),
  check("service").notEmpty().withMessage("Service is required"),
  check("class").notEmpty().withMessage("Class is required"),
  check("city").notEmpty().withMessage("City is required"),
];

// Route to get the profile progress of a user
exports.getUserProfileProgress = async (req, res) => {
  const userId = req.params.id;

  try {
    // Find the user by their ID
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the user's progress value
    res.json({ progress: user.progressValue }); // Assuming progressValue is the field storing progress percentage
  } catch (err) {
    console.error("Error retrieving user progress:", err);
    res.status(500).json({ error: "Error retrieving user progress" });
  }
};

exports.updateProfileProgress = async (req, res) => {
  const userId = req.params.id; // Get userId from the route parameter

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  let progress = 15; // Default progress value

  const collections = [
    UserDependence,
    UserDisability,
    UserDisease,
    UserMedicalCondition,
    UserWorkHistory,
  ];

  let completedCount = 0;

  // Count completed collections
  for (const Collection of collections) {
    const data = await Collection.findOne({ userId: user._id });
    if (data) completedCount++;
  }

  // Add 15 for each completed collection
  progress += completedCount * 15;

  // Add 10 if user is approved
  if (
    user.isSubmited &&
    user.isChecked &&
    user.isRecommended &&
    user.isApproved
  )
    progress += 10;

  // Update user's progress value
  await User.findByIdAndUpdate(userId, { progressValue: progress });

  res.json({ message: "Profile updated successfully", progress });
};

// Get  User using id
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Find by id passed in the request
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed", details: err.message });
  }
};

// Get All Users
exports.getAllUsers = async (_req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
};

// Update user handler
exports.updateUser = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User Not Found" });
    }

    res.json({ message: "Profile updated successfully", data: updatedUser });
  } catch (err) {
    res.status(500).json({ error: "Update failed", details: err.message });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User Not Found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed", details: err.message });
  }
};
