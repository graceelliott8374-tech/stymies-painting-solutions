const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    serviceType: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      trim: true,
    },
    adminNotes: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["new", "contacted", "quoted", "scheduled", "closed"],
      default: "new",
    },
    followUpDate: {
      type: Date,
      default: null,
    },
    archived: { type: Boolean, default: false },
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Lead", LeadSchema);
