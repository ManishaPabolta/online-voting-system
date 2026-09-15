// ======================================================
// CAPTURE LOCATION
// ======================================================

export const captureLocation = async (
  req,
  res
) => {
  try {
    const {
      latitude,
      longitude,
    } = req.body;

    const lat = Number(latitude);
    const lng = Number(longitude);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Valid latitude and longitude are required.",
      });
    }

    if (
      lat < -90 ||
      lat > 90
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Latitude must be between -90 and 90.",
      });
    }

    if (
      lng < -180 ||
      lng > 180
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Longitude must be between -180 and 180.",
      });
    }

    return res.status(200).json({
      success: true,

      location: {
        latitude: lat,
        longitude: lng,
      },
    });
  } catch (error) {
    console.error(
      "CAPTURE LOCATION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to process location.",
    });
  }
};