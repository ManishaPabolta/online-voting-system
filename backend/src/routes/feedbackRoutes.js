import express from "express";

import { createFeedback } from "../controllers/feedbackController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  createFeedback
);

export default router;