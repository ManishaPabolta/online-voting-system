import { body } from "express-validator";

export const voteValidation = [
  body("electionId")
    .notEmpty()
    .withMessage(
      "Election ID required"
    ),

  body("candidateId")
    .notEmpty()
    .withMessage(
      "Candidate ID required"
    ),

  body("latitude")
    .notEmpty()
    .withMessage(
      "Latitude required"
    ),

  body("longitude")
    .notEmpty()
    .withMessage(
      "Longitude required"
    ),
];