import express from "express";
import { getMyProfile, createProfile } from "../controllers/profileController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, upload.single("idProof"), createProfile);

// 👇 THIS FIXES YOUR 404 ERROR
router.get("/me", authMiddleware, getMyProfile);

export default router;