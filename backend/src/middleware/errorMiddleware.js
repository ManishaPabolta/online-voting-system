const errorMiddleware = (err, req, res, next) => {
  // =====================================================
  // LOG ERROR
  // =====================================================

  console.error("ERROR:", {
    message: err?.message,
    name: err?.name,
    statusCode: err?.statusCode,
    method: req?.method,
    url: req?.originalUrl,
  });

  // =====================================================
  // DEFAULT STATUS CODE
  // =====================================================

  let statusCode = err?.statusCode || 500;

  // =====================================================
  // MONGOOSE VALIDATION ERROR
  // =====================================================

  if (err?.name === "ValidationError") {
    statusCode = 400;

    const messages = Object.values(err.errors || {}).map(
      (error) => error.message
    );

    return res.status(statusCode).json({
      success: false,
      message:
        messages.length > 0
          ? messages.join(", ")
          : "Validation failed.",
    });
  }

  // =====================================================
  // MONGOOSE CAST ERROR
  // =====================================================

  if (err?.name === "CastError") {
    statusCode = 400;

    return res.status(statusCode).json({
      success: false,
      message: "Invalid data format.",
    });
  }

  // =====================================================
  // MONGODB DUPLICATE KEY ERROR
  // =====================================================

  if (err?.code === 11000) {
    statusCode = 409;

    const duplicateFields = Object.keys(
      err.keyPattern || err.keyValue || {}
    );

    return res.status(statusCode).json({
      success: false,
      message:
        duplicateFields.length > 0
          ? `Duplicate value for: ${duplicateFields.join(", ")}.`
          : "A record with this value already exists.",
    });
  }

  // =====================================================
  // EXPRESS / MULTER FILE UPLOAD ERRORS
  // =====================================================

  if (err?.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "File size exceeds the allowed limit.",
    });
  }

  // =====================================================
  // STATUS CODE SAFETY
  // =====================================================

  if (
    typeof statusCode !== "number" ||
    statusCode < 400 ||
    statusCode > 599
  ) {
    statusCode = 500;
  }

  // =====================================================
  // PRODUCTION ERROR MESSAGE
  // =====================================================

  const isProduction =
    process.env.NODE_ENV === "production";

  const message =
    isProduction && statusCode === 500
      ? "Internal Server Error."
      : err?.message || "Internal Server Error.";

  // =====================================================
  // FINAL RESPONSE
  // =====================================================

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorMiddleware;