import winston from "winston";

// ======================================================
// LOG FORMAT
// ======================================================

const logFormat =
  winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),

    winston.format.errors({
      stack: true,
    }),

    winston.format.json()
  );

// ======================================================
// LOGGER
// ======================================================

const logger =
  winston.createLogger({
    level:
      process.env.LOG_LEVEL || "info",

    format: logFormat,

    defaultMeta: {
      service: "online-voting-system",
    },

    transports: [
      new winston.transports.Console(),
    ],
  });

// ======================================================
// FILE LOGGER - DEVELOPMENT ONLY
// ======================================================

if (
  process.env.NODE_ENV !== "production"
) {
  logger.add(
    new winston.transports.File({
      filename: "server.log",
      maxsize: 5 * 1024 * 1024,
      maxFiles: 3,
    })
  );
}

export default logger;