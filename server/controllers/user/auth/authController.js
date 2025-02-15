const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../../models/User");

// Register User (Pending Approval)
const registerUser = async (req, res) => {
  const {
    firstName,
    lastName,
    nameWithInitial,
    NIC,
    gender,
    dateOfBirth,
    address,
    workplace,
    email,
    contactNumber,
    password,
  } = req.body;

  try {
    // Check if email already exists
    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: "This email is already registered. Please try a different one"});
      }
    }

    // Check if NIC already exists
    const existingNIC = await User.findOne({ NIC });
    if (existingNIC) {
      return res.status(400).json({ message: "This NIC is already registered. Please try a different one" });
    }

    // Check if contactNumber already exists
    const existingcontactNumber = await User.findOne({ contactNumber });
    if (existingcontactNumber) {
      return res.status(400).json({ message: "This contact number is already registered. Please try a different one"});
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user (Pending approval)
    const newUser = new User({
      firstName,
      lastName,
      nameWithInitial,
      NIC,
      gender,
      dateOfBirth,
      address,
      workplace,
      email,
      contactNumber,
      password: hashedPassword,
    });

    // Save to database
    await newUser.save();

    res.status(201).json({
      message: "Registeration successful",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error"});
  }
};

// Login User (Only Approved Users)
const loginUser = async (req, res) => {
  const { NIC, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ NIC });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Account not found. Please check your NIC" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password. try again" });
    }

    if (!process.env.JWT_SECRET) {
      return console.error(
        "JWT_SECRET is not set in the environment variables."
      );
    }

    // Generate JWT with more user data in the payload
    const token = jwt.sign(
      {
        id: user._id,
        nameWithInitial: user.nameWithInitial,
        NIC: user.NIC,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Adjust expiration time
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        nameWithInitial: user.nameWithInitial,
        NIC: user.NIC,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser };
