import bcrypt from "bcryptjs";

import User from "../models/User.js";

import generateOTP from "../utils/generateOTP.js";

// ======================================================
// OTP CONSTANTS
// ======================================================

const OTP_EXPIRY_MINUTES = 10;

const MAX_OTP_ATTEMPTS = 5;

// ======================================================
// CREATE OTP
// ======================================================

export const createOTP = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  const otp = generateOTP();

  const hashedOTP = await bcrypt.hash(
    String(otp),
    10
  );

  const otpExpiresAt = new Date(
    Date.now() +
      OTP_EXPIRY_MINUTES * 60 * 1000
  );

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        otp: hashedOTP,
        otpExpiresAt,
        otpAttempts: 0,
      },
    },
    {
      new: true,
    }
  );

  if (!user) {
    throw new Error("User not found.");
  }

  return {
    otp,
    expiresAt: otpExpiresAt,
  };
};

// ======================================================
// VERIFY OTP
// ======================================================

export const verifyOTPService = async (
  userId,
  otp
) => {
  if (!userId || !otp) {
    throw new Error(
      "User ID and OTP are required."
    );
  }

  const user = await User.findById(userId).select(
    "+otp +otpExpiresAt +otpAttempts"
  );

  if (!user) {
    throw new Error("User not found.");
  }

  if (!user.otp || !user.otpExpiresAt) {
    throw new Error(
      "No active OTP found. Please request a new OTP."
    );
  }

  if (
    new Date() > user.otpExpiresAt
  ) {
    user.otp = null;
    user.otpExpiresAt = null;
    user.otpAttempts = 0;

    await user.save();

    throw new Error(
      "OTP has expired. Please request a new OTP."
    );
  }

  if (
    user.otpAttempts >= MAX_OTP_ATTEMPTS
  ) {
    user.otp = null;
    user.otpExpiresAt = null;

    await user.save();

    throw new Error(
      "Maximum OTP attempts exceeded."
    );
  }

  const isMatch = await bcrypt.compare(
    String(otp).trim(),
    user.otp
  );

  if (!isMatch) {
    user.otpAttempts += 1;

    await user.save();

    throw new Error("Invalid OTP.");
  }

  user.otp = null;
  user.otpExpiresAt = null;
  user.otpAttempts = 0;
  user.isVerified = true;

  await user.save();

  return true;
};

// ======================================================
// CLEAR OTP
// ======================================================

export const clearOTP = async (userId) => {
  if (!userId) {
    return;
  }

  await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        otp: null,
        otpExpiresAt: null,
        otpAttempts: 0,
      },
    }
  );
};