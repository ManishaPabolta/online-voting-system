const geoLocation = (req) => {
  if (!req) {
    return {
      ipAddress: "",
      userAgent: "",
    };
  }

  return {
    ipAddress:
      req.ip ||
      req.socket?.remoteAddress ||
      "",

    userAgent:
      req.get("user-agent") ||
      "",
  };
};

export default geoLocation;