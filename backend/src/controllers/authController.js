import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import User from "../models/User.js";
import generateOTP from "../utils/generateOTP.js";
import transporter from "../config/mail.js";

// ======================================================
// CONSTANTS
// ======================================================

const OTP_EXPIRY_MINUTES = 10;
const MAX_OTP_ATTEMPTS = 5;

// ======================================================
// HELPERS
// ======================================================

const normalizeEmail = (email = "") => {
  return String(email).trim().toLowerCase();
};

const getClientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];

  if (forwarded) {
    return String(forwarded)
      .split(",")[0]
      .trim();
  }

  return (
    req.ip ||
    req.socket?.remoteAddress ||
    ""
  );
};

// ======================================================
// GENERATE VOTER ID
// ======================================================

const generateVoterId = () => {
  return (
    "VOTER-" +
    crypto
      .randomBytes(5)
      .toString("hex")
      .toUpperCase()
  );
};

// ======================================================
// GENERATE VOTING PASSWORD
// ======================================================
//
// Separate from normal login password.
//
// Plain voting password is sent ONLY through email.
// Only bcrypt hash is stored in MongoDB.
//
// ======================================================

const generateVotingPassword = () => {
  const randomPart = crypto
    .randomBytes(6)
    .toString("hex")
    .toUpperCase();

  return `VOTE-${randomPart}`;
};

// ======================================================
// GENERATE ACCESS TOKEN
// ======================================================

const generateAccessToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error(
      "JWT_SECRET is not configured."
    );
  }

  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn:
        process.env.JWT_EXPIRE || "7d",
    }
  );
};

// ======================================================
// SEND REGISTRATION EMAIL
// ======================================================

const sendRegistrationEmail = async ({
  name,
  email,
  otp,
  voterId,
  votingPassword,
}) => {
  if (!transporter) {
    throw new Error(
      "Email transporter is not configured."
    );
  }

  await transporter.sendMail({
    from:
      process.env.EMAIL_FROM ||
      process.env.EMAIL_USER,

    to: email,

    subject:
      "Online Voting System - Account Verification & Voting Credentials",

    html: `
      <!DOCTYPE html>

      <html>

      <head>
        <meta charset="UTF-8" />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />

        <title>
          Online Voting System
        </title>
      </head>

      <body
        style="
          margin:0;
          padding:0;
          background:#f3f7f5;
          font-family:Arial,Helvetica,sans-serif;
          color:#1f2937;
        "
      >

        <div
          style="
            max-width:620px;
            margin:30px auto;
            padding:20px;
          "
        >

          <div
            style="
              background:#ffffff;
              border-radius:18px;
              padding:35px;
              box-shadow:0 8px 30px rgba(0,0,0,0.08);
            "
          >

            <!-- HEADER -->

            <div
              style="
                text-align:center;
                margin-bottom:30px;
              "
            >

              <h1
                style="
                  margin:0;
                  color:#166534;
                  font-size:28px;
                "
              >
                Online Voting System
              </h1>

              <p
                style="
                  margin-top:8px;
                  color:#6b7280;
                "
              >
                Secure Digital Voting Platform
              </p>

            </div>

            <!-- GREETING -->

            <h2>
              Welcome, ${name}!
            </h2>

            <p
              style="
                line-height:1.6;
                color:#4b5563;
              "
            >
              Your account has been created successfully.
              Please verify your email using the OTP below.
            </p>

            <!-- OTP -->

            <div
              style="
                margin:25px 0;
                padding:25px;
                background:#f0fdf4;
                border:1px solid #bbf7d0;
                border-radius:14px;
                text-align:center;
              "
            >

              <p
                style="
                  margin:0 0 10px;
                  color:#166534;
                  font-size:14px;
                  font-weight:bold;
                "
              >
                EMAIL VERIFICATION OTP
              </p>

              <div
                style="
                  font-size:34px;
                  font-weight:bold;
                  letter-spacing:8px;
                  color:#14532d;
                "
              >
                ${otp}
              </div>

              <p
                style="
                  margin:12px 0 0;
                  font-size:13px;
                  color:#6b7280;
                "
              >
                This OTP expires in
                ${OTP_EXPIRY_MINUTES} minutes.
              </p>

            </div>

            <!-- VOTER ID -->

            <div
              style="
                margin:25px 0;
                padding:20px;
                background:#f9fafb;
                border-radius:14px;
                border:1px solid #e5e7eb;
              "
            >

              <p
                style="
                  margin:0 0 8px;
                  font-size:13px;
                  color:#6b7280;
                "
              >
                YOUR VOTER ID
              </p>

              <h2
                style="
                  margin:0;
                  color:#111827;
                  letter-spacing:1px;
                "
              >
                ${voterId}
              </h2>

            </div>

            <!-- VOTING PASSWORD -->

            <div
              style="
                margin:25px 0;
                padding:22px;
                background:#fff7ed;
                border:1px solid #fed7aa;
                border-radius:14px;
              "
            >

              <p
                style="
                  margin:0 0 8px;
                  font-size:13px;
                  color:#9a3412;
                  font-weight:bold;
                "
              >
                YOUR VOTING PASSWORD
              </p>

              <div
                style="
                  padding:14px;
                  background:#ffffff;
                  border-radius:10px;
                  text-align:center;
                  font-size:22px;
                  font-weight:bold;
                  letter-spacing:2px;
                  color:#9a3412;
                  border:1px dashed #fdba74;
                "
              >
                ${votingPassword}
              </div>

              <p
                style="
                  margin:12px 0 0;
                  font-size:13px;
                  line-height:1.5;
                  color:#7c2d12;
                "
              >
                This password is separate from your
                normal login password. You will need it
                before casting your vote.
              </p>

            </div>

            <!-- SECURITY -->

            <div
              style="
                margin-top:25px;
                padding:18px;
                background:#fef2f2;
                border-radius:12px;
                border-left:4px solid #dc2626;
              "
            >

              <strong
                style="color:#991b1b;"
              >
                Security Notice
              </strong>

              <p
                style="
                  margin:8px 0 0;
                  color:#7f1d1d;
                  font-size:13px;
                  line-height:1.5;
                "
              >
                Never share your OTP or voting password
                with another person. Keep this email secure.
              </p>

            </div>

            <!-- FOOTER -->

            <div
              style="
                margin-top:30px;
                padding-top:20px;
                border-top:1px solid #e5e7eb;
                text-align:center;
                color:#9ca3af;
                font-size:12px;
              "
            >

              <p>
                This is an automated email.
                Please do not reply.
              </p>

              <p>
                Online Voting System
              </p>

            </div>

          </div>

        </div>

      </body>

      </html>
    `,
  });
};

// ======================================================
// REGISTER USER
// ======================================================

export const registerUser = async (req, res) => {
  try {
    let {
      name,
      email,
      password,
    } = req.body;

    name = String(name || "").trim();
    email = normalizeEmail(email);
    password = String(password || "");

    // ==================================================
    // BASIC VALIDATION
    // ==================================================

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required.",
      });
    }

    if (name.length < 2) {
      return res.status(400).json({
        success: false,
        message:
          "Name must contain at least 2 characters.",
      });
    }

    if (name.length > 100) {
      return res.status(400).json({
        success: false,
        message:
          "Name cannot contain more than 100 characters.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 6 characters.",
      });
    }

    // ==================================================
    // EMAIL VALIDATION
    // ==================================================

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid email address.",
      });
    }

    // ==================================================
    // CHECK EXISTING USER
    // ==================================================

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {
      if (!existingUser.isVerified) {
        return res.status(409).json({
          success: false,
          message:
            "An account with this email already exists but is not verified. Please verify your OTP.",
          requiresVerification: true,
          email,
        });
      }

      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists.",
      });
    }

    // ==================================================
    // HASH NORMAL LOGIN PASSWORD
    // ==================================================

    const hashedPassword =
      await bcrypt.hash(password, 12);

    // ==================================================
    // GENERATE OTP
    // ==================================================

    const otp =
      String(generateOTP()).trim();

    if (!otp) {
      throw new Error(
        "OTP generation failed."
      );
    }

    const hashedOtp =
      await bcrypt.hash(otp, 10);

    const otpExpiresAt =
      new Date(
        Date.now() +
          OTP_EXPIRY_MINUTES *
            60 *
            1000
      );

    // ==================================================
    // GENERATE VOTING PASSWORD
    // ==================================================

    const votingPassword =
      generateVotingPassword();

    const hashedVotingPassword =
      await bcrypt.hash(
        votingPassword,
        12
      );

    // ==================================================
    // GENERATE VOTER ID
    // ==================================================

    const voterId =
      generateVoterId();

    // ==================================================
    // CREATE USER
    // ==================================================

    const user =
      await User.create({
        name,
        email,

        // Normal login password
        password: hashedPassword,

        // Separate voting password
        votingPassword:
          hashedVotingPassword,

        // OTP
        otp: hashedOtp,
        otpExpiresAt,
        otpAttempts: 0,

        // Voter ID
        voterId,

        // Account state
        role: "user",
        isVerified: false,
        isActive: true,
        isBlocked: false,
        profileCompleted: false,

        phone: "",
        profileImage: "",
      });

    // ==================================================
    // SEND EMAIL
    // ==================================================

    try {
      await sendRegistrationEmail({
        name,
        email,
        otp,
        voterId,
        votingPassword,
      });
    } catch (mailError) {
      console.error(
        "REGISTRATION EMAIL ERROR:",
        mailError.message
      );

      /*
       * Important:
       *
       * Do NOT return votingPassword or OTP
       * in the API response.
       *
       * The account exists in MongoDB, so the user
       * needs a resend/recovery mechanism.
       */

      return res.status(201).json({
        success: true,
        message:
          "Registration was created, but the verification email could not be sent. Please request a new verification email.",
        requiresVerification: true,
        email,
      });
    }

    // ==================================================
    // SUCCESS
    // ==================================================

    return res.status(201).json({
      success: true,

      message:
        "Registration successful. Please verify your email using the OTP sent to your email.",

      requiresVerification: true,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        voterId: user.voterId,
      },
    });
  } catch (error) {
    console.error(
      "REGISTER USER ERROR:",
      error
    );

    // ==================================================
    // DUPLICATE KEY
    // ==================================================

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "An account with these details already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Registration failed. Please try again.",
    });
  }
};

// ======================================================
// VERIFY OTP
// ======================================================

export const verifyOTP = async (req, res) => {
  try {
    let {
      email,
      otp,
    } = req.body;

    email = normalizeEmail(email);
    otp = String(otp || "").trim();

    // ==================================================
    // VALIDATION
    // ==================================================

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message:
          "Email and OTP are required.",
      });
    }

    // ==================================================
    // FIND USER
    // ==================================================

    const user =
      await User.findOne({
        email,
      }).select(
        "+otp +otpExpiresAt +otpAttempts"
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found.",
      });
    }

    // ==================================================
    // ACCOUNT STATUS
    // ==================================================

    if (
      user.isBlocked ||
      !user.isActive
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Your account is disabled. Please contact support.",
      });
    }

    // ==================================================
    // ALREADY VERIFIED
    // ==================================================

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message:
          "Account is already verified.",
      });
    }

    // ==================================================
    // OTP AVAILABILITY
    // ==================================================

    if (
      !user.otp ||
      !user.otpExpiresAt
    ) {
      return res.status(400).json({
        success: false,
        message:
          "OTP is not available. Please request a new OTP.",
      });
    }

    // ==================================================
    // OTP EXPIRY
    // ==================================================

    if (
      new Date() >
      user.otpExpiresAt
    ) {
      return res.status(400).json({
        success: false,
        message:
          "OTP has expired. Please request a new OTP.",
        expired: true,
      });
    }

    // ==================================================
    // MAX ATTEMPTS
    // ==================================================

    if (
      user.otpAttempts >=
      MAX_OTP_ATTEMPTS
    ) {
      return res.status(429).json({
        success: false,
        message:
          "Too many incorrect OTP attempts. Please request a new OTP.",
      });
    }

    // ==================================================
    // COMPARE OTP
    // ==================================================

    const isValidOtp =
      await bcrypt.compare(
        otp,
        user.otp
      );

    if (!isValidOtp) {
      user.otpAttempts =
        (user.otpAttempts || 0) + 1;

      await user.save();

      return res.status(400).json({
        success: false,

        message:
          "Invalid OTP.",

        attemptsRemaining:
          Math.max(
            0,
            MAX_OTP_ATTEMPTS -
              user.otpAttempts
          ),
      });
    }

    // ==================================================
    // SUCCESSFUL VERIFICATION
    // ==================================================

    user.isVerified = true;

    user.otp = null;

    user.otpExpiresAt = null;

    user.otpAttempts = 0;

    await user.save();

    return res.status(200).json({
      success: true,

      message:
        "Email verified successfully. You can now login.",

      verified: true,
    });
  } catch (error) {
    console.error(
      "VERIFY OTP ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "OTP verification failed. Please try again.",
    });
  }
};

// ======================================================
// LOGIN USER
// ======================================================

export const loginUser = async (req, res) => {
  try {
    let {
      email,
      password,
    } = req.body;

    email = normalizeEmail(email);
    password = String(password || "");

    // ==================================================
    // VALIDATION
    // ==================================================

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required.",
      });
    }

    // ==================================================
    // FIND USER
    // ==================================================

    const user =
      await User.findOne({
        email,
      }).select(
        "+password"
      );

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    // ==================================================
    // ACCOUNT STATUS
    // ==================================================

    if (
      user.isBlocked ||
      !user.isActive
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Your account has been disabled. Please contact support.",
      });
    }

    // ==================================================
    // EMAIL VERIFICATION
    // ==================================================

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message:
          "Please verify your email before logging in.",
        requiresVerification: true,
      });
    }

    // ==================================================
    // VERIFY LOGIN PASSWORD
    // ==================================================

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    // ==================================================
    // LOGIN INFORMATION
    // ==================================================

    user.lastLogin =
      new Date();

    user.lastLoginIp =
      getClientIp(req);

    await user.save();

    // ==================================================
    // GENERATE TOKEN
    // ==================================================

    const token =
      generateAccessToken(user);

    // ==================================================
    // SAFE RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,

      message:
        "Login successful.",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        voterId: user.voterId,

        profileCompleted:
          user.profileCompleted,

        isVerified:
          user.isVerified,

        profileImage:
          user.profileImage || "",
      },
    });
  } catch (error) {
    console.error(
      "LOGIN USER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Login failed. Please try again.",
    });
  }
};

// ======================================================
// GET CURRENT USER
// ======================================================

export const getMe = async (req, res) => {
  try {
    // req.user is populated by authMiddleware

    const user =
      await User.findById(
        req.user.id
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found.",
      });
    }

    return res.status(200).json({
      success: true,

      user: {
        id: user._id,

        name: user.name,

        email: user.email,

        role: user.role,

        voterId:
          user.voterId,

        phone:
          user.phone || "",

        profileImage:
          user.profileImage || "",

        profileCompleted:
          user.profileCompleted,

        isVerified:
          user.isVerified,

        isActive:
          user.isActive,

        createdAt:
          user.createdAt,

        lastLogin:
          user.lastLogin,
      },
    });
  } catch (error) {
    console.error(
      "GET ME ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch your account.",
    });
  }
};