import { body } from "express-validator";

// ======================================================
// CREATE / UPDATE ELECTION VALIDATION
// ======================================================

export const electionValidation = [
  // ====================================================
  // TITLE
  // ====================================================

  body("title")
    .trim()
    .notEmpty()
    .withMessage(
      "Election title is required."
    )
    .isLength({
      min: 3,
      max: 200,
    })
    .withMessage(
      "Election title must be between 3 and 200 characters."
    ),

  // ====================================================
  // DESCRIPTION
  // ====================================================

  body("description")
    .optional()
    .trim()
    .isLength({
      max: 10000,
    })
    .withMessage(
      "Description cannot exceed 10,000 characters."
    ),

  // ====================================================
  // ELECTION TYPE
  // ====================================================

  body("electionType")
    .optional()
    .isIn([
      "PRESIDENTIAL",
      "PARLIAMENTARY",
      "ASSEMBLY",
      "LOCAL",
      "COLLEGE",
      "ORGANIZATION",
      "OTHER",
    ])
    .withMessage(
      "Invalid election type."
    ),

  // ====================================================
  // START DATE
  // ====================================================

  body("startDate")
    .notEmpty()
    .withMessage(
      "Start date is required."
    )
    .isISO8601()
    .withMessage(
      "Start date must be a valid ISO date."
    )
    .custom((value) => {
      const start = new Date(value);

      if (Number.isNaN(start.getTime())) {
        throw new Error(
          "Invalid start date."
        );
      }

      if (start <= new Date()) {
        throw new Error(
          "Start date must be in the future."
        );
      }

      return true;
    }),

  // ====================================================
  // END DATE
  // ====================================================

  body("endDate")
    .notEmpty()
    .withMessage(
      "End date is required."
    )
    .isISO8601()
    .withMessage(
      "End date must be a valid ISO date."
    )
    .custom((value, { req }) => {
      const start = new Date(
        req.body.startDate
      );

      const end = new Date(value);

      if (
        Number.isNaN(start.getTime()) ||
        Number.isNaN(end.getTime())
      ) {
        throw new Error(
          "Invalid election dates."
        );
      }

      if (end <= start) {
        throw new Error(
          "End date must be after start date."
        );
      }

      return true;
    }),

  // ====================================================
  // PUBLISHED
  // ====================================================

  body("isPublished")
    .optional()
    .isBoolean()
    .withMessage(
      "isPublished must be true or false."
    )
    .toBoolean(),

  // ====================================================
  // RESULTS BEFORE END
  // ====================================================

  body("allowResultsBeforeEnd")
    .optional()
    .isBoolean()
    .withMessage(
      "allowResultsBeforeEnd must be true or false."
    )
    .toBoolean(),
];