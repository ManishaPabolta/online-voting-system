import mongoose from "mongoose";

const voterProfileSchema = new mongoose.Schema(
  {
    // =====================================================
    // USER REFERENCE
    // =====================================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    // =====================================================
    // BASIC DETAILS
    // =====================================================

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    age: {
      type: Number,
      required: true,
      min: 18,
      max: 120,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
      trim: true,
    },

    // =====================================================
    // ADDRESS
    // =====================================================

    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    city: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    state: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    pincode: {
      type: String,
      trim: true,
      maxlength: 10,
      default: "",
      validate: {
        validator: function (value) {
          if (!value) return true;

          return /^[0-9]{4,10}$/.test(value);
        },
        message: "Please enter a valid pincode.",
      },
    },

    // =====================================================
    // CONTACT DETAILS
    // =====================================================

    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
      validate: {
        validator: function (value) {
          return /^[0-9+\-\s()]{7,20}$/.test(value);
        },
        message: "Please enter a valid phone number.",
      },
    },

    // =====================================================
    // IDENTITY INFORMATION
    // =====================================================

    /*
     * Sensitive information.
     *
     * It will NOT be returned by normal MongoDB queries.
     * Explicit selection is required for authorized
     * verification/admin operations.
     */

    aadhaarNumber: {
      type: String,
      required: true,
      trim: true,
      select: false,
      validate: {
        validator: function (value) {
          return /^\d{12}$/.test(value);
        },
        message: "Aadhaar number must contain exactly 12 digits.",
      },
    },

    voterId: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
      index: true,
    },

    idProof: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1000,
    },

    // =====================================================
    // PROFILE PHOTO
    // =====================================================

    profilePhoto: {
      type: String,
      trim: true,
      default: "",
      maxlength: 2000,
    },

    // =====================================================
    // PROFILE STATUS
    // =====================================================

    /*
     * True only when all mandatory profile information
     * has been completed.
     */

    isComplete: {
      type: Boolean,
      default: false,
      index: true,
    },

    /*
     * True only when voter is allowed to vote.
     *
     * This should normally become true only after
     * successful verification.
     */

    isEligible: {
      type: Boolean,
      default: false,
      index: true,
    },

    // =====================================================
    // VERIFICATION
    // =====================================================

    verificationStatus: {
      type: String,
      enum: [
        "PENDING",
        "VERIFIED",
        "REJECTED",
      ],
      default: "PENDING",
      index: true,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// =========================================================
// INDEXES
// =========================================================

voterProfileSchema.index({
  voterId: 1,
});

voterProfileSchema.index({
  verificationStatus: 1,
  isEligible: 1,
});

voterProfileSchema.index({
  isComplete: 1,
  isEligible: 1,
});

// =========================================================
// PRE-VALIDATE
// =========================================================
//
// Keep verification state and eligibility consistent.
//
// VERIFIED  -> eligible can be true
// PENDING   -> eligible must be false
// REJECTED  -> eligible must be false
//
// =========================================================

voterProfileSchema.pre("validate", function (next) {
  if (
    this.verificationStatus !== "VERIFIED"
  ) {
    this.isEligible = false;
    this.verifiedAt = null;
  }

  if (
    this.verificationStatus === "VERIFIED" &&
    !this.verifiedAt
  ) {
    this.verifiedAt = new Date();
  }

  next();
});

// =========================================================
// PROFILE COMPLETENESS METHOD
// =========================================================

voterProfileSchema.methods.calculateCompleteness =
  function () {
    const requiredFields = [
      this.name,
      this.age,
      this.gender,
      this.address,
      this.phone,
      this.aadhaarNumber,
      this.voterId,
    ];

    const complete = requiredFields.every(
      (value) =>
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
    );

    this.isComplete = complete;

    return complete;
  };

// =========================================================
// ELIGIBILITY HELPER
// =========================================================

voterProfileSchema.methods.canVote = function () {
  return (
    this.isComplete === true &&
    this.isEligible === true &&
    this.verificationStatus === "VERIFIED"
  );
};

// =========================================================
// SAFE JSON OUTPUT
// =========================================================
//
// Aadhaar is already select:false, but this extra
// protection ensures it is not accidentally serialized
// if explicitly selected somewhere.
//
// =========================================================

voterProfileSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.aadhaarNumber;

    return ret;
  },
});

voterProfileSchema.set("toObject", {
  virtuals: true,
});

// =========================================================
// MODEL
// =========================================================

const VoterProfile = mongoose.model(
  "VoterProfile",
  voterProfileSchema
);

export default VoterProfile;