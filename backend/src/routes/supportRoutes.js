import express from "express";

import { sendMessage } from "../controllers/supportController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/chat",
  authMiddleware,
  sendMessage
);

export default router;