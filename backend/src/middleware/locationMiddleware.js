const locationMiddleware = (
  req,
  res,
  next
) => {
  try {
    const {
      latitude,
      longitude,
    } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Location required",
      });
    }

    req.location = {
      latitude,
      longitude,
    };

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default locationMiddleware;