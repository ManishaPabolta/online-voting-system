import crypto from "crypto";

// ======================================================
// GENERATE 6 DIGIT OTP
// ======================================================

const generateOTP = () => {
  return crypto
    .randomInt(100000, 1000000)
    .toString();
};

export default generateOTP;