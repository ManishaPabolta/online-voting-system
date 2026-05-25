import AuditLog from "../models/AuditLog.js";

export const createAuditLog =
  async ({
    user,
    action,
    ipAddress,
    deviceInfo,
  }) => {
    const audit =
      await AuditLog.create({
        user,
        action,
        ipAddress,
        deviceInfo,
      });

    return audit;
  };

export const getAuditLogs =
  async () => {
    return await AuditLog.find()
      .populate("user")
      .sort({
        createdAt: -1,
      });
  };