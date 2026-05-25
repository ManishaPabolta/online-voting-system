import express from "express";

import {
  createCandidate,
  getCandidates,
} from "../controllers/candidateController.js";

import authMiddleware from "../middleware/authMiddleware.js";

import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  createCandidate
);

router.get("/", getCandidates);

export default router;