// server/src/validators/reviewValidators.js
const { body, param } = require("express-validator");

exports.createReview = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ max: 50 }),

  body("lastInitial")
    .trim()
    .notEmpty()
    .withMessage("Last initial is required")
    .isLength({ min: 1, max: 1 })
    .matches(/^[A-Z]$/i)
    .withMessage("Last initial must be a single letter"),

  body("serviceType")
    .trim()
    .notEmpty()
    .withMessage("Service type is required")
    .isLength({ max: 100 }),

  body("city").optional().trim().isLength({ max: 100 }),

  body("serviceDate")
    .optional({ checkFalsy: true })
    .matches(/^\d{4}-(0[1-9]|1[0-2])$/)
    .withMessage("Service date must be YYYY-MM"),

  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  body("reviewText")
    .trim()
    .notEmpty()
    .withMessage("Review text is required")
    .isLength({ max: 2000 })
    .withMessage("Review is too long"),
];

exports.reviewIdParam = [
  param("id").isMongoId().withMessage("Invalid review ID"),
];
