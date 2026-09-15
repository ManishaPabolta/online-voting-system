import { body } from "express-validator";

// ======================================================
// REGISTER VALIDATION
// ======================================================

export const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({
      min: 2,
      max: 100,
    })
    .withMessage(
      "Name must be between 2 and 100 characters."
    ),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({
      min: 6,
      max: 128,
    })
    .withMessage(
      "Password must be between 6 and 128 characters."
    ),
];

// ======================================================
// LOGIN VALIDATION
// ======================================================

export const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({
      max: 128,
    })
    .withMessage(
      "Password cannot exceed 128 characters."
    ),
];

// ======================================================
// OTP VALIDATION
// ======================================================

export const otpValidation = [
  body("otp")
    .trim()
    .notEmpty()
    .withMessage("OTP is required.")
    .matches(/^\d{6}$/)
    .withMessage(
      "OTP must contain exactly 6 digits."
    ),
];