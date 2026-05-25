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

    // VALIDATION
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // CHECK EXISTING USER
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // GENERATE OTP
    const otp = generateOTP();

    // 🔥 GENERATE VOTER ID (NEW ADD)
    const voterId = "VOTER-" + crypto.randomBytes(4).toString("hex").toUpperCase();

    // CREATE USER
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      isVerified: false,

      // 🔥 NEW FIELDS
      voterId,
      profileCompleted: false,
    });

    // SEND OTP EMAIL
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Online Voting System OTP Verification",
      html: `
        <div style="padding:20px;font-family:Arial">

          <h2>Online Voting System</h2>

          <p>Your OTP for verification is:</p>

          <h1 style="color:blue">${otp}</h1>

          <p>OTP expires in ${process.env.OTP_EXPIRE_MINUTES || 10} minutes.</p>

          <hr/>

          <p><b>Your Voter ID:</b></p>
          <h2 style="color:green">${user.voterId}</h2>

          <p>Save this Voter ID for voting login.</p>

        </div>
      `,
    });

    console.log("OTP + VOTER ID SENT =>", otp, user.voterId);

    res.status(201).json({
      success: true,
      message: "Registration successful. OTP + Voter ID sent to email.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        voterId: user.voterId,
      },
    });

  } catch (error) {
    console.log("REGISTER ERROR =>", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= VERIFY OTP =================
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    user.isVerified = true;
    user.otp = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP Verified Successfully",
    });

  } catch (error) {
    console.log("VERIFY OTP ERROR =>", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= LOGIN USER =================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE || "7d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,

        // 🔥 NEW RETURN FIELD
        voterId: user.voterId,
        profileCompleted: user.profileCompleted,
      },
    });

  } catch (error) {
    console.log("LOGIN ERROR =>", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= GET CURRENT USER =================
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.log("GET ME ERROR =>", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};