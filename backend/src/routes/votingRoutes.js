import express from "express";

import {
  castVote,
  getVoteStatus,
} from "../controllers/votingController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import mfaMiddleware from "../middleware/mfaMiddleware.js";
import locationMiddleware from "../middleware/locationMiddleware.js";
import voteSecurityMiddleware from "../middleware/voteSecurityMiddleware.js";
import checkProfileComplete from "../middleware/profileCheckMiddleware.js";

const router = express.Router();

// 🔥 CAST VOTE (FULL SECURITY FLOW)
router.post(
  "/cast",
  authMiddleware,
  checkProfileComplete,     // ✅ PROFILE CHECK ADDED
  mfaMiddleware,            // OTP
  locationMiddleware,
  voteSecurityMiddleware,
  castVote
);

// STATUS
router.get("/status", authMiddleware, getVoteStatus);

export default router;