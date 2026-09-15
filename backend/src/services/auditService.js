import AuditLog from "../models/AuditLog.js";

// ======================================================
// CREATE AUDIT LOG
// ======================================================

export const createAuditLog = async ({
  user = null,
  action,
  ipAddress = "",
  deviceInfo = "",
}) => {
  if (!action) {
    throw new Error("Audit action is required.");
  }

  const auditLog = await AuditLog.create({
    user,
    action: String(action).trim(),
    ipAddress: String(ipAddress || "").trim(),
    deviceInfo: String(deviceInfo || "").trim(),
  });

  return auditLog;
};

// ======================================================
// GET AUDIT LOGS
// ======================================================

export const getAuditLogs = async ({
  userId = null,
  limit = 100,
} = {}) => {
  const safeLimit = Math.min(
    Math.max(Number(limit) || 100, 1),
    500
  );

  const filter = {};

  if (userId) {
    filter.user = userId;
  }

  return AuditLog.find(filter)
    .populate("user", "name email role voterId")
    .sort({ createdAt: -1 })
    .limit(safeLimit)
    .lean();
};

// ======================================================
// GET AUDIT LOGS FOR SPECIFIC USER
// ======================================================

export const getUserAuditLogs = async (userId, limit = 100) => {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  return getAuditLogs({
    userId,
    limit,
  });
};