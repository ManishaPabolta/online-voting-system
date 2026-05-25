import express from "express";

import {
  registerUser,
  verifyOTP,
  loginUser,
  getMe,
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/verify-otp", verifyOTP);

router.post("/login", loginUser);

router.get("/me", authMiddleware, getMe);

export default router;