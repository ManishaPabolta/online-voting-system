import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import User from "../models/User.js";

import generateOTP from "../utils/generateOTP.js";

import transporter from "../config/mail.js";

// ================= REGISTER USER =================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ================= VALIDATION =================
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ================= CHECK USER =================
    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // ================= HASH PASSWORD =================
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // ================= GENERATE OTP =================
    const otp = generateOTP();

    // ================= GENERATE VOTER ID =================
    const voterId =
      "VOTER-" +
      crypto
        .randomBytes(4)
        .toString("hex")
        .toUpperCase();

    // ================= CREATE USER =================
    const user = await User.create({
      name,
      email,
      password: hashedPassword,

      otp,
      isVerified: false,

      voterId,
      profileCompleted: false,
    });

    // ================= SEND MAIL =================
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,

        to: email,

        subject:
          "Online Voting System Verification",

        html: `
          <div style="padding:20px;font-family:Arial">

            <h2>
              Welcome to Online Voting System
            </h2>

            <p>
              Your OTP Verification Code:
            </p>

            <h1 style="color:blue">
              ${otp}
            </h1>

            <hr />

            <p>
              Your Voter ID:
            </p>

            <h2 style="color:green">
              ${voterId}
            </h2>

            <p>
              Keep this voter ID safe.
            </p>

          </div>
        `,
      });

      console.log(
        "OTP MAIL SENT =>",
        email
      );
    } catch (mailError) {
      console.log(
        "MAIL ERROR =>",
        mailError.message
      );

      // 🔥 IMPORTANT
      // USER CREATE HO JAYEGA
      // AGAR MAIL FAIL BHI HO
    }

    // ================= RESPONSE =================
    return res.status(201).json({
      success: true,

      message:
        "Registration successful",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        voterId: user.voterId,
      },
    });
  } catch (error) {
    console.log(
      "REGISTER ERROR =>",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Registration failed",
    });
  }
};

// ================= VERIFY OTP =================
export const verifyOTP = async (
  req,
  res
) => {
  try {
    const { email, otp } =
      req.body;

    // ================= VALIDATION =================
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message:
          "Email and OTP required",
      });
    }

    // ================= FIND USER =================
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ================= OTP CHECK =================
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // ================= VERIFY USER =================
    user.isVerified = true;
    user.otp = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "OTP verified successfully",
    });
  } catch (error) {
    console.log(
      "VERIFY OTP ERROR =>",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "OTP verification failed",
    });
  }
};

// ================= LOGIN USER =================
export const loginUser = async (
  req,
  res
) => {
  try {
    const { email, password } =
      req.body;

    // ================= VALIDATION =================
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password required",
      });
    }

    // ================= FIND USER =================
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // ================= PASSWORD CHECK =================
    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid credentials",
      });
    }

    // ================= VERIFY CHECK =================
    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message:
          "Please verify OTP first",
      });
    }

    // ================= UPDATE LOGIN =================
    user.lastLogin = new Date();

    await user.save();

    // ================= JWT TOKEN =================
    const token = jwt.sign(
      {
        id: user._id,
      },

      process.env.JWT_SECRET,

      {
        expiresIn:
          process.env.JWT_EXPIRE ||
          "7d",
      }
    );

    // ================= RESPONSE =================
    return res.status(200).json({
      success: true,

      message: "Login successful",

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
      },
    });
  } catch (error) {
    console.log(
      "LOGIN ERROR =>",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Login failed",
    });
  }
};

// ================= GET CURRENT USER =================
export const getMe = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.user.id
      ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(
      "GET ME ERROR =>",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch user",
    });
  }
};