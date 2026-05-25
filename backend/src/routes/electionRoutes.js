import express from "express";

import {
  createElection,
  getAllElections,
  getElectionById,
  updateElection,
  deleteElection,
} from "../controllers/electionController.js";

const router = express.Router();

// ================= CREATE =================
router.post(
  "/",
  createElection
);

// ================= GET ALL =================
router.get(
  "/",
  getAllElections
);

// ================= GET SINGLE =================
router.get(
  "/:id",
  getElectionById
);

// ================= UPDATE =================
router.put(
  "/:id",
  updateElection
);

// ================= DELETE =================
router.delete(
  "/:id",
  deleteElection
);

export default router;