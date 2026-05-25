const geoLocation = (req) => {
  return {
    ipAddress:
      req.headers[
        "x-forwarded-for"
      ] || req.socket.remoteAddress,

    userAgent:
      req.headers[
        "user-agent"
      ],
  };
};

export default geoLocation;