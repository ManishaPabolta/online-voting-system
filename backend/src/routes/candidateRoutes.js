import express from "express";

import {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
} from "../controllers/candidateController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import auditMiddleware from "../middleware/auditMiddleware.js";

const router = express.Router();

// ==========================================================
// PUBLIC ROUTES
// ==========================================================

// Get candidates
// Example:
// GET /api/candidates
// GET /api/candidates?election=ELECTION_ID
// GET /api/candidates?election=ELECTION_ID&active=true
router.get("/", getCandidates);

// Get single candidate
// Example:
// GET /api/candidates/:id
router.get("/:id", getCandidateById);

// ==========================================================
// ADMIN ROUTES
// ==========================================================

// Create candidate
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  auditMiddleware,
  createCandidate
);

// Update candidate
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  auditMiddleware,
  updateCandidate
);

// Delete candidate
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  auditMiddleware,
  deleteCandidate
);

export default router;