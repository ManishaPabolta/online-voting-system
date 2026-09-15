import AuditLog from "../models/AuditLog.js";

const auditMiddleware = async (req, res, next) => {
  try {
    // =====================================================
    // GET USER ID
    // =====================================================

    const userId =
      req.user?._id ||
      req.user?.id ||
      null;

    // =====================================================
    // GET USER AGENT / DEVICE INFO
    // =====================================================

    const userAgent =
      req.get("user-agent") || "";

    // =====================================================
    // GET CLIENT IP
    // =====================================================
    // Render / production environments may use proxies.
    // x-forwarded-for can contain multiple IP addresses.

    const forwardedFor =
      req.headers["x-forwarded-for"];

    let ipAddress = "";

    if (forwardedFor) {
      ipAddress = Array.isArray(forwardedFor)
        ? forwardedFor[0]
        : forwardedFor.split(",")[0].trim();
    }

    if (!ipAddress) {
      ipAddress =
        req.ip ||
        req.socket?.remoteAddress ||
        "";
    }

    // =====================================================
    // CREATE AUDIT LOG
    // =====================================================

    await AuditLog.create({
      user: userId,
      action: `${req.method} ${req.originalUrl}`,
      ipAddress,
      deviceInfo: userAgent,
    });

    // =====================================================
    // CONTINUE REQUEST
    // =====================================================

    next();
  } catch (error) {
    // =====================================================
    // AUDIT FAILURE MUST NOT BREAK REQUEST
    // =====================================================

    console.error(
      "AUDIT LOG ERROR:",
      error.message
    );

    next();
  }
};

export default auditMiddleware;