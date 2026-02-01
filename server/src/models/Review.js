// server/src/models/Review.js
const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastInitial: { type: String, required: true, trim: true, maxlength: 1 },

    serviceType: { type: String, required: true, trim: true },
    city: { type: String, trim: true, default: "" },

    // Keep as string because the form may send "" or a "YYYY-MM-DD" style value.
    // You can switch to Date later if you want strict parsing.
    serviceDate: {
      type: String,
      trim: true,
      match: /^\d{4}-(0[1-9]|1[0-2])$/, // YYYY-MM
      default: "",
    },

    rating: { type: Number, required: true, min: 1, max: 5 },

    reviewText: { type: String, required: true, trim: true, maxlength: 2000 },

    // Your moderation flow
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    approvedAt: { type: Date, default: null },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },

    // Helpful for audits and spam triage
    submittedAt: { type: Date, default: Date.now },
    source: { type: String, trim: true, default: "website" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Review", ReviewSchema);
