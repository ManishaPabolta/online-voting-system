import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // =====================================================
    // BASIC USER INFORMATION
    // =====================================================

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    // =====================================================
    // NORMAL LOGIN PASSWORD
    // =====================================================
    // Used when the user logs into the voting system.

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },


    votingPassword: {
      type: String,
      select: false,
      default: null,
    },

    // =====================================================
    // USER ROLE
    // =====================================================

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      index: true,
    },

    // =====================================================
    // VOTER INFORMATION
    // =====================================================

    voterId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      uppercase: true,
      index: true,
    },

    // =====================================================
    // PROFILE INFORMATION
    // =====================================================

    profileImage: {
      type: String,
      trim: true,
      default: "",
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    // =====================================================
    // OTP VERIFICATION
    // =====================================================

    otp: {
      type: String,
      select: false,
      default: null,
    },

    otpExpiresAt: {
      type: Date,
      select: false,
      default: null,
    },

    otpAttempts: {
      type: Number,
      default: 0,
      min: 0,
      select: false,
    },

    // =====================================================
    // ACCOUNT VERIFICATION / STATUS
    // =====================================================

    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isBlocked: {
      type: Boolean,
      default: false,
      index: true,
    },

    // =====================================================
    // PROFILE COMPLETION
    // =====================================================

    profileCompleted: {
      type: Boolean,
      default: false,
    },

    // =====================================================
    // LOGIN INFORMATION
    // =====================================================

    lastLogin: {
      type: Date,
      default: null,
    },

    lastLoginIp: {
      type: String,
      default: "",
      select: false,
    },

    // =====================================================
    // REFRESH TOKEN
    // =====================================================

    refreshToken: {
      type: String,
      default: null,
      select: false,
    },

    refreshTokenExpiresAt: {
      type: Date,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// =========================================================
// INDEXES
// =========================================================

userSchema.index({
  role: 1,
  isActive: 1,
});

userSchema.index({
  createdAt: -1,
});

// =========================================================
// MODEL
// =========================================================

const User = mongoose.model("User", userSchema);

export default User;