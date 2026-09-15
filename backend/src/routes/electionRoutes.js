import express from "express";

import {
  createElection,
  getAllElections,
  getPublicElections,
  getElectionById,
  updateElection,
  publishElection,
  cancelElection,
  deleteElection,
} from "../controllers/electionController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import auditMiddleware from "../middleware/auditMiddleware.js";

const router = express.Router();

/* ==========================================================
   PUBLIC ELECTION ROUTES
========================================================== */

/*
 * Get published elections
 *
 * GET /api/elections/public
 *
 * Public access
 */
router.get(
  "/public",
  getPublicElections
);

/*
 * Get single published election
 *
 * GET /api/elections/:id
 *
 * Public access
 *
 * IMPORTANT:
 * Keep this route after /public so "public"
 * is not treated as an election ID.
 */
router.get(
  "/:id",
  getElectionById
);

/* ==========================================================
   ADMIN ELECTION ROUTES
========================================================== */

/*
 * Get all elections
 *
 * GET /api/elections
 *
 * Admin only
 *
 * Includes:
 * - Draft
 * - Upcoming
 * - Live
 * - Completed
 * - Cancelled
 */
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAllElections
);

/*
 * Create election
 *
 * POST /api/elections
 *
 * Admin only
 */
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  auditMiddleware,
  createElection
);

/*
 * Update election
 *
 * PUT /api/elections/:id
 *
 * Admin only
 */
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  auditMiddleware,
  updateElection
);

/*
 * Publish election
 *
 * PATCH /api/elections/:id/publish
 *
 * Admin only
 */
router.patch(
  "/:id/publish",
  authMiddleware,
  adminMiddleware,
  auditMiddleware,
  publishElection
);

/*
 * Cancel election
 *
 * PATCH /api/elections/:id/cancel
 *
 * Admin only
 */
router.patch(
  "/:id/cancel",
  authMiddleware,
  adminMiddleware,
  auditMiddleware,
  cancelElection
);

/*
 * Delete election
 *
 * DELETE /api/elections/:id
 *
 * Admin only
 */
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  auditMiddleware,
  deleteElection
);

export default router;