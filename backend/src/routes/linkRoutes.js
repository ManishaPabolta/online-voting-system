import express from "express";

import { generateVotingLink } from "../controllers/linkController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/generate",
  authMiddleware,
  generateVotingLink
);

export default router;