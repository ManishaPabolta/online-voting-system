import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  try {
    // =====================================================
    // CHECK JWT SECRET
    // =====================================================

    if (!process.env.JWT_SECRET) {
      console.error(
        "AUTH MIDDLEWARE ERROR: JWT_SECRET is not configured."
      );

      return res.status(500).json({
        success: false,
        message: "Authentication service is not configured properly.",
      });
    }

    // =====================================================
    // GET AUTHORIZATION HEADER
    // =====================================================

    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Token missing.",
      });
    }

    // =====================================================
    // CHECK BEARER FORMAT
    // =====================================================

    if (!authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format.",
      });
    }

    // =====================================================
    // EXTRACT TOKEN
    // =====================================================

    const token = authorization.substring(7).trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Token missing.",
      });
    }

    // =====================================================
    // VERIFY JWT
    // =====================================================

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // =====================================================
    // VALIDATE DECODED TOKEN
    // =====================================================

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    // =====================================================
    // VALIDATE USER ID
    // =====================================================

    if (!mongoose.isValidObjectId(decoded.id)) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    // =====================================================
    // FIND USER
    // =====================================================

    const user = await User.findById(decoded.id).select(
      "-password -votingPassword -otp -otpExpiresAt -otpAttempts -refreshToken -refreshTokenExpiresAt -lastLoginIp"
    );

    // =====================================================
    // USER NOT FOUND
    // =====================================================

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account not found.",
      });
    }

    // =====================================================
    // ACCOUNT ACTIVE CHECK
    // =====================================================

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive.",
      });
    }

    // =====================================================
    // ACCOUNT BLOCK CHECK
    // =====================================================

    if (user.isBlocked === true) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked.",
      });
    }

    // =====================================================
    // EMAIL / OTP VERIFICATION CHECK
    // =====================================================

    if (user.isVerified !== true) {
      return res.status(403).json({
        success: false,
        message: "Please verify your account first.",
      });
    }

    // =====================================================
    // ATTACH SAFE USER TO REQUEST
    // =====================================================

    req.user = user;

    // =====================================================
    // CONTINUE REQUEST
    // =====================================================

    next();
  } catch (error) {
    console.error(
      "AUTH MIDDLEWARE ERROR:",
      error.message
    );

    // =====================================================
    // TOKEN EXPIRED
    // =====================================================

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Authentication token expired.",
      });
    }

    // =====================================================
    // INVALID JWT
    // =====================================================

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    // =====================================================
    // INVALID TOKEN FORMAT
    // =====================================================

    if (error.name === "NotBeforeError") {
      return res.status(401).json({
        success: false,
        message: "Authentication token is not active yet.",
      });
    }

    // =====================================================
    // OTHER AUTHENTICATION ERRORS
    // =====================================================

    return res.status(401).json({
      success: false,
      message: "Authentication failed.",
    });
  }
};

export default authMiddleware;