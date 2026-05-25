import express from "express";

import { captureLocation } from "../controllers/locationController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/capture",
  authMiddleware,
  captureLocation
);

export default router;