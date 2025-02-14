const mongoose = require("mongoose");

const UserWorkHistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Foreign key reference
    start_date: { type: Date, required: true }, // Use Date type for dates
    end_date: { type: Date, required: true },
    workplace: { type: String, required: true },
    workplace_type: { type: String, required: true },
    workplace_city: { type: String, required: true },
    workplace_postalcode: { type: String, required: true }, // Fixed data type
    designation: { type: String, required: true },

  },
  { timestamps: true }
);

module.exports = mongoose.model("UserWorkHistory", UserWorkHistorySchema);
