import express from "express";

import {
  castVote,
  getVoteStatus,
  checkVoteStatus,
  getElectionResults,
} from "../controllers/votingController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import mfaMiddleware from "../middleware/mfaMiddleware.js";
import locationMiddleware from "../middleware/locationMiddleware.js";
import voteSecurityMiddleware from "../middleware/voteSecurityMiddleware.js";
import checkProfileComplete from "../middleware/profileCheckMiddleware.js";

const router = express.Router();

// ==========================================================
// CAST VOTE
// ==========================================================
// Full security flow:
//
// Authentication
//      ↓
// Voter profile verification
//      ↓
// Voting password verification
//      ↓
// Location verification
//      ↓
// Duplicate-vote security
//      ↓
// Cast vote

router.post(
  "/cast",
  authMiddleware,
  checkProfileComplete,
  mfaMiddleware,
  locationMiddleware,
  voteSecurityMiddleware,
  castVote
);

// ==========================================================
// VOTING HISTORY
// ==========================================================

router.get(
  "/status",
  authMiddleware,
  getVoteStatus
);

// ==========================================================
// CHECK SPECIFIC ELECTION STATUS
// ==========================================================

router.get(
  "/status/:electionId",
  authMiddleware,
  checkVoteStatus
);

// ==========================================================
// ELECTION RESULTS
// ==========================================================

router.get(
  "/results/:id",
  getElectionResults
);

export default router;