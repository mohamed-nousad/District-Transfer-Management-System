const jwt = require("jsonwebtoken");
const Admin = require("../../models/Admin"); // Use Admin model for admin authentication

// Register Admin
exports.registerAdmin = async (req, res) => {
  const { adminId, adminRole, workplace, password } = req.body;
  let errors = [];

  // Check if all required fields are provided
  if (!adminId) errors.push("Admin ID is required");
  if (!adminRole) errors.push("Admin Role is required");
  if (!workplace) errors.push("Workplace is required");
  if (!password) errors.push("Password is required");

  if (errors.length > 0) return res.status(400).json({ errors });

  try {
    // Check if Admin already exists
    const existingAdmin = await Admin.findOne({ adminId });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin ID already exists" });
    }

    const newAdmin = new Admin({
      adminId,
      adminRole,
      workplace,
      password,
    });

    // Save to database
    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const generateTokens = (admin) => {
  // Access token: includes adminId and adminRole, expires in 15 minutes
  const accessToken = jwt.sign(
    { adminId: admin._id, adminRole: admin.adminRole }, // Include adminRole here
    process.env.JWT_SECRET,
    { expiresIn: "5m" }
  );

  return { accessToken };
};

exports.loginAdmin = async (req, res) => {
  const { adminId, password } = req.body;

  try {
    const admin = await Admin.findOne({ adminId });
    if (!admin)
      return res.status(401).json({ message: "Admin ID is incorrect" });

    if (admin.password !== password)
      return res.status(401).json({ message: "Password is incorrect" });

    const { accessToken } = generateTokens(admin); // Only generate access token

    return res.json({
      message: "Login successful",
      accessToken,
      adminRole: admin.adminRole,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
