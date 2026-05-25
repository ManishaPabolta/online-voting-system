import { body } from "express-validator";

export const electionValidation = [
  // ================= TITLE =================
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Election title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 to 100 characters"),

  // ================= DESCRIPTION =================
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Election description is required")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long"),

  // ================= START DATE =================
  body("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Start date must be a valid date (YYYY-MM-DD format)")
    .custom((value) => {
      const start = new Date(value);
      const now = new Date();

      if (start < now.setHours(0, 0, 0, 0)) {
        throw new Error("Start date cannot be in the past");
      }

      return true;
    }),

  // ================= END DATE =================
  body("endDate")
    .notEmpty()
    .withMessage("End date is required")
    .isISO8601()
    .withMessage("End date must be a valid date (YYYY-MM-DD format)")
    .custom((value, { req }) => {
      const start = new Date(req.body.startDate);
      const end = new Date(value);

      if (end <= start) {
        throw new Error("End date must be after start date");
      }

      return true;
    }),
];