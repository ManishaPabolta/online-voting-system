import express from "express";

import {
  registerUser,
  verifyOTP,
  loginUser,
  getMe,
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| AUTHENTICATION ROUTES
|--------------------------------------------------------------------------
*/

/*
 * Register new voter
 *
 * POST /api/auth/register
 *
 * Public route
 */
router.post(
  "/register",
  registerUser
);

/*
 * Verify registration email OTP
 *
 * POST /api/auth/verify-otp
 *
 * Public route
 */
router.post(
  "/verify-otp",
  verifyOTP
);

/*
 * Login user
 *
 * POST /api/auth/login
 *
 * Public route
 */
router.post(
  "/login",
  loginUser
);

/*
 * Get currently authenticated user
 *
 * GET /api/auth/me
 *
 * Protected route
 */
router.get(
  "/me",
  authMiddleware,
  getMe
);

export default router;