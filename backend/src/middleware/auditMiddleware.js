import AuditLog from "../models/AuditLog.js";

const auditMiddleware = async (
  req,
  res,
  next
) => {
  try {
    await AuditLog.create({
      user: req.user?._id,
      action: `${req.method} ${req.originalUrl}`,
      ipAddress: req.ip,
    });

    next();
  } catch (error) {
    console.log(
      "Audit Log Error:",
      error.message
    );

    next();
  }
};

export default auditMiddleware;