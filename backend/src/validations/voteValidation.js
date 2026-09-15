import { body } from "express-validator";

// ======================================================
// VOTE VALIDATION
// ======================================================

export const voteValidation = [
  // ====================================================
  // ELECTION ID
  // ====================================================

  body("electionId")
    .trim()
    .notEmpty()
    .withMessage(
      "Election ID is required."
    )
    .isMongoId()
    .withMessage(
      "Invalid election ID."
    ),

  // ====================================================
  // CANDIDATE ID
  // ====================================================

  body("candidateId")
    .trim()
    .notEmpty()
    .withMessage(
      "Candidate ID is required."
    )
    .isMongoId()
    .withMessage(
      "Invalid candidate ID."
    ),

  // ====================================================
  // LATITUDE
  // ====================================================

  body("latitude")
    .notEmpty()
    .withMessage(
      "Latitude is required."
    )
    .isFloat({
      min: -90,
      max: 90,
    })
    .withMessage(
      "Latitude must be between -90 and 90."
    )
    .toFloat(),

  // ====================================================
  // LONGITUDE
  // ====================================================

  body("longitude")
    .notEmpty()
    .withMessage(
      "Longitude is required."
    )
    .isFloat({
      min: -180,
      max: 180,
    })
    .withMessage(
      "Longitude must be between -180 and 180."
    )
    .toFloat(),
];