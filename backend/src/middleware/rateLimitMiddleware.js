import rateLimit from "express-rate-limit";

const rateLimitMiddleware = rateLimit({
  // =====================================================
  // RATE LIMIT WINDOW
  // =====================================================

  windowMs: 15 * 60 * 1000,

  // =====================================================
  // MAX REQUESTS
  // =====================================================

  max: 100,

  // =====================================================
  // RESPONSE HEADERS
  // =====================================================

  standardHeaders: true,
  legacyHeaders: false,

  // =====================================================
  // RATE LIMIT RESPONSE
  // =====================================================

  message: {
    success: false,
    message:
      "Too many requests. Please try again later.",
  },
});

export default rateLimitMiddleware;