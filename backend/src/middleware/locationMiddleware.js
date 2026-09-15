const locationMiddleware = (req, res, next) => {
  try {
    // =====================================================
    // GET LOCATION FROM REQUEST BODY
    // =====================================================

    const { latitude, longitude } = req.body || {};

    // =====================================================
    // REQUIRED CHECK
    // =====================================================

    if (
      latitude === undefined ||
      latitude === null ||
      longitude === undefined ||
      longitude === null ||
      String(latitude).trim() === "" ||
      String(longitude).trim() === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Location is required before voting.",
      });
    }

    // =====================================================
    // CONVERT TO NUMBERS
    // =====================================================

    const parsedLatitude = Number(latitude);
    const parsedLongitude = Number(longitude);

    // =====================================================
    // NUMBER VALIDATION
    // =====================================================

    if (
      !Number.isFinite(parsedLatitude) ||
      !Number.isFinite(parsedLongitude)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid location coordinates.",
      });
    }

    // =====================================================
    // LATITUDE RANGE
    // =====================================================

    if (
      parsedLatitude < -90 ||
      parsedLatitude > 90
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid latitude. Latitude must be between -90 and 90.",
      });
    }

    // =====================================================
    // LONGITUDE RANGE
    // =====================================================

    if (
      parsedLongitude < -180 ||
      parsedLongitude > 180
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid longitude. Longitude must be between -180 and 180.",
      });
    }

    // =====================================================
    // SAVE VALIDATED LOCATION
    // =====================================================

    req.location = {
      latitude: parsedLatitude,
      longitude: parsedLongitude,
    };

    // =====================================================
    // CONTINUE REQUEST
    // =====================================================

    next();
  } catch (error) {
    console.error(
      "LOCATION MIDDLEWARE ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to validate location.",
    });
  }
};

export default locationMiddleware;