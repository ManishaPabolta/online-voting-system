import mongoose from "mongoose";

import VoterProfile from "../models/VoterProfile.js";

const checkProfileComplete = async (req, res, next) => {
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
    // GET USER ID
    // =====================================================

    const userId =
      req.user._id ||
      req.user.id;

    if (
      !userId ||
      !mongoose.isValidObjectId(userId)
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid authenticated user.",
      });
    }

    // =====================================================
    // FIND VOTER PROFILE
    // =====================================================

    const profile = await VoterProfile.findOne({
      user: userId,
    });

    // =====================================================
    // PROFILE NOT FOUND
    // =====================================================

    if (!profile) {
      return res.status(403).json({
        success: false,
        message:
          "Please complete your voter profile before voting.",
      });
    }

    // =====================================================
    // REQUIRED PROFILE DETAILS
    // =====================================================

    const isIncomplete =
      !profile.name ||
      profile.age === undefined ||
      profile.age === null ||
      !profile.gender ||
      !profile.address ||
      !profile.phone ||
      !profile.voterId;

    if (isIncomplete) {
      return res.status(403).json({
        success: false,
        message:
          "Please complete all required voter profile details.",
      });
    }

    // =====================================================
    // PROFILE COMPLETION FLAG
    // =====================================================

    if (profile.isComplete !== true) {
      return res.status(403).json({
        success: false,
        message:
          "Please complete your voter profile before voting.",
      });
    }

    // =====================================================
    // VERIFICATION STATUS
    // =====================================================

    if (profile.verificationStatus !== "VERIFIED") {
      if (
        profile.verificationStatus === "REJECTED"
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Your voter profile verification was rejected.",
        });
      }

      return res.status(403).json({
        success: false,
        message:
          "Your voter profile is awaiting verification.",
      });
    }

    // =====================================================
    // ELIGIBILITY CHECK
    // =====================================================

    if (profile.isEligible !== true) {
      return res.status(403).json({
        success: false,
        message:
          "You are not currently eligible to vote.",
      });
    }

    // =====================================================
    // ATTACH PROFILE TO REQUEST
    // =====================================================

    req.voterProfile = profile;

    // =====================================================
    // PROFILE VERIFIED & ELIGIBLE
    // =====================================================

    next();
  } catch (error) {
    console.error(
      "PROFILE CHECK ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to verify voter profile.",
    });
  }
};

export default checkProfileComplete;