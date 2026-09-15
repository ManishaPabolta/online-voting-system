import { validationResult } from "express-validator";

const validationMiddleware = (req, res, next) => {
  try {
    const errors = validationResult(req);

    // =====================================================
    // VALIDATION FAILED
    // =====================================================

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: errors.array().map((error) => ({
          type: error.type,
          path: error.path,
          message: error.msg,
          value: error.value,
        })),
      });
    }

    // =====================================================
    // VALIDATION PASSED
    // =====================================================

    next();
  } catch (error) {
    console.error(
      "VALIDATION MIDDLEWARE ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to validate request.",
    });
  }
};

export default validationMiddleware;