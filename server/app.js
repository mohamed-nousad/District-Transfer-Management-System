const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Load environment variables
dotenv.config();

// Ensure required env variables are set
if (!process.env.MONGO_URL) {
  console.error("❌ MONGO_URL is missing.");
  process.exit(1);
}

if (!process.env.JWT_SECRET) console.warn("⚠️ JWT_SECRET is missing.");

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "https://district-transfer-management-system-jado.vercel.app",
    credentials: true,
  })
);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// Import Routes
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const adminRoutes = require("./routes/adminRoutes");
const auth = require("./routes/auth");
const userRoutes = require("./routes/userRoutes");

// API Routes
app.use("/api/auth/admin", adminAuthRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", auth);
app.use("/api/user", userRoutes);

// Error Handling
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message });
});

module.exports = app;
