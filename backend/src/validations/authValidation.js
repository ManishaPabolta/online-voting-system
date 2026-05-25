import { body } from "express-validator";

export const registerValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")

    .isLength({ min: 3 })
    .withMessage(
      "Name must be at least 3 characters"
    ),

  body("email")
    .isEmail()
    .withMessage(
      "Valid email required"
    ),

  body("password")
    .isLength({ min: 6 })
    .withMessage(
      "Password must be at least 6 characters"
    ),
];

export const loginValidation = [
  body("email")
    .isEmail()
    .withMessage(
      "Valid email required"
    ),

  body("password")
    .notEmpty()
    .withMessage(
      "Password is required"
    ),
];

export const otpValidation = [
  body("otp")
    .notEmpty()
    .withMessage(
      "OTP is required"
    )

    .isLength({ min: 6, max: 6 })
    .withMessage(
      "OTP must be 6 digits"
    ),
];