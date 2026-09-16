import express from "express";

import {
  registerUser,
  verifyOTP,
  resendOTP,
  loginUser,
  getMe,
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ======================================================
// PUBLIC AUTH ROUTES
// ======================================================

// Register new user
// POST /api/auth/register
router.post(
  "/register",
  registerUser
);

// Verify email OTP
// POST /api/auth/verify-otp
router.post(
  "/verify-otp",
  verifyOTP
);

// Resend email verification OTP
// POST /api/auth/resend-otp
router.post(
  "/resend-otp",
  resendOTP
);

// Login user
// POST /api/auth/login
router.post(
  "/login",
  loginUser
);

// ======================================================
// PROTECTED AUTH ROUTES
// ======================================================

// Get currently authenticated user
// GET /api/auth/me
router.get(
  "/me",
  authMiddleware,
  getMe
);

export default router;