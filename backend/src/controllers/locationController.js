export const captureLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    res.status(200).json({
      success: true,
      location: {
        latitude,
        longitude,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};