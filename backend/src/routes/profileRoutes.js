import express from "express";

import {
  getMyProfile,
  createProfile,
  updateProfile,
} from "../controllers/profileController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

/* =========================================================
   CREATE VOTER PROFILE
   POST /api/profile
   ========================================================= */
router.post(
  "/",
  authMiddleware,
  upload.single("idProof"),
  createProfile
);

/* =========================================================
   GET MY PROFILE
   GET /api/profile/me
   ========================================================= */
router.get(
  "/me",
  authMiddleware,
  getMyProfile
);

/* =========================================================
   UPDATE MY PROFILE
   PUT /api/profile
   ========================================================= */
router.put(
  "/",
  authMiddleware,
  upload.single("idProof"),
  updateProfile
);

export default router;