const mongoose = require("mongoose");

const UserDependenceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"], // Custom message
    },
    dependentName: {
      type: String,
      required: [true, "Dependent name is required"], // Custom message
    },
    dependentRelationship: {
      type: String,
      required: [true, "Dependent relationship is required"], // Custom message
    },
    dependentNIC: {
      type: String,
      unique: true,
      sparse: true,
    },
    workplace: {
      type: String,
      default: null,
    },
    gender: {
      type: String,
      required: [true, "Gender is required"], // Custom message
    },
    dependent_DOB: {
      type: Date,
      required: [true, "Dependent Date of Birth is required"], // Custom message
    },
    school: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      required: [true, "City is required"], // Custom message
    },
    postalcode: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserDependence", UserDependenceSchema);
