// server/src/routes/reviewRoutes.js
const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");

const reviewController = require("../controllers/reviewController");
const reviewValidators = require("../validators/reviewValidators");

// PUBLIC
// Create a review (always becomes pending)
router.post("/", reviewValidators.createReview, reviewController.createReview);

// Get approved reviews for the website
router.get("/", reviewController.getApprovedReviews);

// ADMIN
// Everything below requires admin
router.use(requireAuth);
router.use(requireRole("admin"));

// List reviews for moderation (pending/approved/rejected, filterable via query)
router.get("/admin", reviewController.adminListReviews);

// Approve a review
router.patch(
  "/:id/approve",
  reviewValidators.reviewIdParam,
  reviewController.approveReview,
);

// Reject a review
router.patch(
  "/:id/reject",
  reviewValidators.reviewIdParam,
  reviewController.rejectReview,
);

// Delete a review
router.delete(
  "/:id",
  reviewValidators.reviewIdParam,
  reviewController.deleteReview,
);

module.exports = router;
