import { body } from "express-validator";

export const feedbackValidation = [
  body("message")
    .notEmpty()
    .withMessage(
      "Feedback message required"
    )

    .isLength({ min: 5 })
    .withMessage(
      "Feedback too short"
    ),

  body("rating")
    .isNumeric()
    .withMessage(
      "Rating must be number"
    )

    .custom((value) => {
      if (
        value < 1 ||
        value > 5
      ) {
        throw new Error(
          "Rating must be between 1 and 5"
        );
      }

      return true;
    }),
];