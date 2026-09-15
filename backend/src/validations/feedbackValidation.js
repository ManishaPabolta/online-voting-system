import { body } from "express-validator";

// ======================================================
// FEEDBACK VALIDATION
// ======================================================

export const feedbackValidation = [
  // ====================================================
  // MESSAGE
  // ====================================================

  body("message")
    .trim()
    .notEmpty()
    .withMessage(
      "Feedback message is required."
    )
    .isLength({
      min: 5,
      max: 2000,
    })
    .withMessage(
      "Feedback message must be between 5 and 2000 characters."
    ),

  // ====================================================
  // RATING
  // ====================================================

  body("rating")
    .notEmpty()
    .withMessage(
      "Rating is required."
    )
    .isInt({
      min: 1,
      max: 5,
    })
    .withMessage(
      "Rating must be an integer between 1 and 5."
    )
    .toInt(),
];