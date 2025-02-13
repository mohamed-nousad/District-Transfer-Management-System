const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    nameWithInitial: { type: String, required: true },
    NIC: { type: String, required: true, unique: true }, // Unique NIC
    gender: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    address: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    contactNumber: { type: String, required: true },
    password: { type: String, required: true },

    //Null fields: Users can still update their profile after registration is approved by the admin
    first_appointment_date: { type: Date, default: null },
    duty_assumed_date: { type: Date, default: null },
    workplace: { type: String, default: null },
    postal_code: { type: String, default: null },
    designation: { type: String, default: null },
    current_workplace: { type: String, default: null },
    service: { type: String, default: null },
    class: { type: String, default: null },
    city: { type: String, default: null },

    progressValue: { type: Number, default: 13 }, // isSubmited status
    isSubmited: { type: Boolean, default: false }, // isSubmited status
    isChecked: { type: Boolean, default: false }, // isChecked status
    isRecommended: { type: Boolean, default: false }, // isRecommended status
    isApproved: { type: Boolean, default: false }, // isApproved status
    isRejected: { type: Boolean, default: false }, // isRejected status
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
