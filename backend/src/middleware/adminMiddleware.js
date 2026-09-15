const adminMiddleware = (req, res, next) => {
  try {
    // =====================================================
    // AUTHENTICATION CHECK
    // =====================================================

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    // =====================================================
    // ADMIN ROLE CHECK
    // =====================================================

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access only.",
      });
    }

    // =====================================================
    // ADMIN AUTHORIZED
    // =====================================================

    next();
  } catch (error) {
    console.error(
      "ADMIN MIDDLEWARE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to verify admin access.",
    });
  }
};

export default adminMiddleware;