import { body } from "express-validator";

// ======================================================
// PROFILE VALIDATION
// ======================================================

export const profileValidation = [
  // ====================================================
  // NAME
  // ====================================================

  body("name")
    .trim()
    .notEmpty()
    .withMessage(
      "Name is required."
    )
    .isLength({
      min: 2,
      max: 100,
    })
    .withMessage(
      "Name must be between 2 and 100 characters."
    ),

  // ====================================================
  // AGE
  // ====================================================

  body("age")
    .notEmpty()
    .withMessage(
      "Age is required."
    )
    .isInt({
      min: 18,
      max: 120,
    })
    .withMessage(
      "Age must be between 18 and 120 years."
    )
    .toInt(),

  // ====================================================
  // GENDER
  // ====================================================

  body("gender")
    .notEmpty()
    .withMessage(
      "Gender is required."
    )
    .isIn([
      "Male",
      "Female",
      "Other",
    ])
    .withMessage(
      "Invalid gender."
    ),

  // ====================================================
  // ADDRESS
  // ====================================================

  body("address")
    .trim()
    .notEmpty()
    .withMessage(
      "Address is required."
    )
    .isLength({
      max: 1000,
    })
    .withMessage(
      "Address cannot exceed 1000 characters."
    ),

  // ====================================================
  // CITY
  // ====================================================

  body("city")
    .optional()
    .trim()
    .isLength({
      max: 100,
    })
    .withMessage(
      "City cannot exceed 100 characters."
    ),

  // ====================================================
  // STATE
  // ====================================================

  body("state")
    .optional()
    .trim()
    .isLength({
      max: 100,
    })
    .withMessage(
      "State cannot exceed 100 characters."
    ),

  // ====================================================
  // PINCODE
  // ====================================================

  body("pincode")
    .optional()
    .trim()
    .matches(/^\d{4,10}$/)
    .withMessage(
      "Please enter a valid pincode."
    ),

  // ====================================================
  // PHONE
  // ====================================================

  body("phone")
    .notEmpty()
    .withMessage(
      "Phone number is required."
    )
    .trim()
    .matches(/^[0-9+\-\s()]{7,20}$/)
    .withMessage(
      "Please enter a valid phone number."
    ),

  // ====================================================
  // AADHAAR
  // ====================================================

  body("aadhaarNumber")
    .notEmpty()
    .withMessage(
      "Aadhaar number is required."
    )
    .trim()
    .matches(/^\d{12}$/)
    .withMessage(
      "Aadhaar number must contain exactly 12 digits."
    ),

  // ====================================================
  // VOTER ID
  // ====================================================

  body("voterId")
    .trim()
    .notEmpty()
    .withMessage(
      "Voter ID is required."
    )
    .isLength({
      min: 3,
      max: 50,
    })
    .withMessage(
      "Invalid voter ID."
    ),
];