const bcrypt = require("bcryptjs");
const User = require("../../../models/User");

// Change Password Controller
const changePassword = async (req, res) => {
  const { NIC, oldPassword, newPassword } = req.body;

  try {
    // Find the user by NIC
    const user = await User.findOne({ NIC });
    if (!user) {
      return res.status(404).json({ message: "User not found. Please check your NIC." });
    }

    // Validate the old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect old password. Please try again." });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password in the database
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    console.error("Change Password Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { changePassword };
