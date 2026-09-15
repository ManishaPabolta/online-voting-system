import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import User from "../models/User.js";

const mfaMiddleware = async (req, res, next) => {
  try {
    // =====================================================
    // AUTHENTICATION CHECK
    // =====================================================

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    // =====================================================
    // GET VOTING PASSWORD FROM REQUEST
    // =====================================================

    const { votingPassword } = req.body || {};

    if (
      typeof votingPassword !== "string" ||
      votingPassword.trim().length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Voting password is required.",
      });
    }

    const cleanedVotingPassword =
      votingPassword.trim();

    // =====================================================
    // GET USER ID
    // =====================================================

    const userId =
      req.user._id ||
      req.user.id;

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(401).json({
        success: false,
        message: "Invalid authenticated user.",
      });
    }

    // =====================================================
    // GET USER WITH VOTING PASSWORD
    // =====================================================
    // votingPassword is select:false in User.js,
    // so it must be explicitly selected.

    const user = await User.findById(userId).select(
      "+votingPassword"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account not found.",
      });
    }

    // =====================================================
    // ACCOUNT STATUS CHECK
    // =====================================================

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive.",
      });
    }

    if (user.isBlocked === true) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked.",
      });
    }

    // =====================================================
    // EMAIL / ACCOUNT VERIFICATION
    // =====================================================

    if (user.isVerified !== true) {
      return res.status(403).json({
        success: false,
        message: "Please verify your account first.",
      });
    }

    // =====================================================
    // CHECK VOTING PASSWORD CONFIGURATION
    // =====================================================

    if (
      typeof user.votingPassword !== "string" ||
      user.votingPassword.length === 0
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Voting password is not configured for this account.",
      });
    }

    // =====================================================
    // VERIFY VOTING PASSWORD
    // =====================================================

    const isValid = await bcrypt.compare(
      cleanedVotingPassword,
      user.votingPassword
    );

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid voting password.",
      });
    }

    // =====================================================
    // VOTING PASSWORD VERIFIED
    // =====================================================

    req.votingPasswordVerified = true;

    // =====================================================
    // CONTINUE REQUEST
    // =====================================================

    next();
  } catch (error) {
    console.error(
      "VOTING PASSWORD ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to verify voting password.",
    });
  }
};

export default mfaMiddleware;