import mongoose from "mongoose";

import Vote from "../models/Vote.js";

const voteSecurityMiddleware = async (
  req,
  res,
  next
) => {
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
    // GET ELECTION ID
    // =====================================================

    const { electionId } = req.body || {};

    if (!electionId) {
      return res.status(400).json({
        success: false,
        message: "Election ID is required.",
      });
    }

    // =====================================================
    // VALIDATE ELECTION ID
    // =====================================================

    if (!mongoose.isValidObjectId(electionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid election ID.",
      });
    }

    // =====================================================
    // CHECK EXISTING VOTE
    // =====================================================

    const existingVote = await Vote.findOne({
      voter: userId,
      election: electionId,
    }).select("_id");

    if (existingVote) {
      return res.status(409).json({
        success: false,
        message:
          "You have already voted in this election.",
      });
    }

    // =====================================================
    // SAVE ELECTION ID FOR NEXT MIDDLEWARE/CONTROLLER
    // =====================================================

    req.electionId = electionId;

    // =====================================================
    // CONTINUE
    // =====================================================

    next();
  } catch (error) {
    console.error(
      "VOTE SECURITY ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to verify voting security.",
    });
  }
};

export default voteSecurityMiddleware;