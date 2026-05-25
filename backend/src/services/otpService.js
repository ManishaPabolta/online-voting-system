import generateOTP from "../utils/generateOTP.js";

import User from "../models/User.js";

export const createOTP = async (
  userId
) => {
  const otp = generateOTP();

  await User.findByIdAndUpdate(
    userId,
    {
      otp,
    }
  );

  return otp;
};

export const verifyOTPService =
  async (userId, otp) => {
    const user =
      await User.findById(userId);

    if (!user) {
      throw new Error(
        "User not found"
      );
    }

    if (user.otp !== otp) {
      throw new Error(
        "Invalid OTP"
      );
    }

    user.otp = null;

    user.isVerified = true;

    await user.save();

    return true;
  };