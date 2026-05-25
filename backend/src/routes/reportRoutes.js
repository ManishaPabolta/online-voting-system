import express from "express";

import { generateReport } from "../controllers/reportController.js";

import authMiddleware from "../middleware/authMiddleware.js";

import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  generateReport
);

export default router;