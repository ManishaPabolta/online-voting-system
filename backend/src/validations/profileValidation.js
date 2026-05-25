import { body } from "express-validator";

export const profileValidation = [
  body("age")
    .isNumeric()
    .withMessage(
      "Age must be numeric"
    )

    .custom((value) => {
      if (value < 18) {
        throw new Error(
          "You must be at least 18 years old"
        );
      }

      return true;
    }),

  body("address")
    .notEmpty()
    .withMessage(
      "Address is required"
    ),

  body("aadhaarNumber")
    .isLength({
      min: 12,
      max: 12,
    })
    .withMessage(
      "Aadhaar must be 12 digits"
    ),

  body("voterId")
    .notEmpty()
    .withMessage(
      "Voter ID required"
    ),
];