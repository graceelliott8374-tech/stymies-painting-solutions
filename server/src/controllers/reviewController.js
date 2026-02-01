// server/src/controllers/reviewController.js
const Review = require("../models/Review");

/**
 * PUBLIC
 * Create a new review (always pending)
 */
exports.createReview = async (req, res, next) => {
  try {
    const review = await Review.create({
      firstName: req.body.firstName,
      lastInitial: req.body.lastInitial,
      serviceType: req.body.serviceType,
      city: req.body.city || "",
      serviceDate: req.body.serviceDate || "",
      rating: req.body.rating,
      reviewText: req.body.reviewText,
      source: "website",
      status: "pending",
    });

    return res.status(201).json({
      message: "Review submitted for approval",
      reviewId: review._id,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUBLIC
 * Get approved reviews only (for website display)
 */
exports.getApprovedReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ status: "approved" })
      .sort({ approvedAt: -1, createdAt: -1 })
      .select("-__v");

    return res.json(reviews);
  } catch (err) {
    next(err);
  }
};

/**
 * ADMIN
 * List reviews for moderation
 * ?status=pending|approved|rejected
 */
exports.adminListReviews = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const reviews = await Review.find(filter)
      .sort({ createdAt: -1 })
      .select("-__v");

    return res.json(reviews);
  } catch (err) {
    next(err);
  }
};

/**
 * ADMIN
 * Approve a review
 */
exports.approveReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      {
        status: "approved",
        approvedAt: new Date(),
        approvedBy: req.user._id,
      },
      { new: true },
    );

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    return res.json({ message: "Review approved" });
  } catch (err) {
    next(err);
  }
};

/**
 * ADMIN
 * Reject a review
 */
exports.rejectReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      {
        status: "rejected",
        approvedAt: null,
        approvedBy: req.user._id,
      },
      { new: true },
    );

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    return res.json({ message: "Review rejected" });
  } catch (err) {
    next(err);
  }
};

/**
 * ADMIN
 * Delete a review permanently
 */
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    return res.json({ message: "Review deleted" });
  } catch (err) {
    next(err);
  }
};
