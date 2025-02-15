const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  adminId: { type: String, required: true, unique: true },
  adminRole: { type: String, required: true, unique: true },
  workplace: { type: String, required: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model("Admin", AdminSchema);
