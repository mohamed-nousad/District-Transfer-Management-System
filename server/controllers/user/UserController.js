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
  check("postal_code").notEmpty().withMessage("Postal code is required"),
  check("designation").notEmpty().withMessage("Designation is required"),
  check("current_workplace")
    .notEmpty()
    .withMessage("Current workplace is required"),
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

  const user = await User.findById(userId); // Get the user object

  if (!user) {
    throw new Error("User not found");
  }

  // Initialize progress counter
  let progress = 0;
  const totalCollections = 6; // 6 collections (including approval)
  const progressPerCollection = 13; // Each collection contributes 13% (6*13 = 78%)

  // Query all related collections
  const UserDependence = await UserDependence.findOne({ user_Id: user._id });
  const UserDisability = await UserDisability.findOne({ user_Id: user._id });
  const UserDisease = await UserDisease.findOne({ user_Id: user._id });
  const UserMedicalCondition = await UserMedicalCondition.findOne({
    user_Id: user._id,
  });
  const UserWorkHistory = await UserWorkHistory.findOne({ user_Id: user._id });

  // Check which collections have data and add progress
  if (UserDependence) progress += progressPerCollection;
  if (UserDisability) progress += progressPerCollection;
  if (UserDisease) progress += progressPerCollection;
  if (UserMedicalCondition) progress += progressPerCollection;
  if (UserWorkHistory) progress += progressPerCollection;

  // Update user's progress value
  await User.findByIdAndUpdate(userId, { progressValue: progress });

  return progress; // Return the calculated progress value
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
