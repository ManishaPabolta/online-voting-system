const mfaMiddleware = async (req, res, next) => {
  const { otp } = req.body;

  if (!otp) {
    return res.status(400).json({
      success: false,
      message: "OTP required",
    });
  }

  // demo OTP
  if (otp !== "123456") {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  }

  next();
};

export default mfaMiddleware;