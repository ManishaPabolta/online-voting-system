import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    // =====================================================
    // VOTER
    // =====================================================

    voter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // =====================================================
    // ELECTION
    // =====================================================

    election: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
      required: true,
      index: true,
    },

    // =====================================================
    // SELECTED CANDIDATE
    // =====================================================

    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
      index: true,
    },

    // =====================================================
    // VOTE CAST TIME
    // =====================================================

    castAt: {
      type: Date,
      default: Date.now,
      required: true,
      index: true,
    },

    // =====================================================
    // VOTING LOCATION
    // =====================================================
    /*
     * Captured during the voting process.
     *
     * These values are sensitive and therefore excluded
     * from normal queries using select: false.
     *
     * They can explicitly be selected for authorized
     * security/audit purposes when required.
     */

    latitude: {
      type: Number,
      min: -90,
      max: 90,
      default: null,
      select: false,
    },

    longitude: {
      type: Number,
      min: -180,
      max: 180,
      default: null,
      select: false,
    },

    // =====================================================
    // IP ADDRESS
    // =====================================================

    ipAddress: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
      select: false,
    },

    // =====================================================
    // DEVICE / USER AGENT
    // =====================================================

    deviceInfo: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// =========================================================
// CRITICAL SECURITY INDEX
// =========================================================
//
// ONE voter can cast ONLY ONE vote in ONE election.
//
// voter A + election 1 → ALLOWED
// voter A + election 1 → BLOCKED
// voter A + election 2 → ALLOWED
//
// This database-level unique constraint protects against
// duplicate votes even when multiple requests arrive at
// almost the same time.
//
// =========================================================

voteSchema.index(
  {
    voter: 1,
    election: 1,
  },
  {
    unique: true,
    name: "unique_voter_per_election",
  }
);

// =========================================================
// ELECTION + CANDIDATE INDEX
// =========================================================
//
// Useful for candidate-wise vote aggregation.
//
// =========================================================

voteSchema.index({
  election: 1,
  candidate: 1,
});

// =========================================================
// ELECTION + TIME INDEX
// =========================================================
//
// Useful for:
//
// - election reports
// - voting analytics
// - audit queries
// - chronological vote records
//
// =========================================================

voteSchema.index({
  election: 1,
  castAt: -1,
});

// =========================================================
// VOTER + TIME INDEX
// =========================================================
//
// Useful when retrieving a user's voting history.
//
// =========================================================

voteSchema.index({
  voter: 1,
  castAt: -1,
});

// =========================================================
// VALIDATE OBJECT REFERENCES
// =========================================================
//
// This validates that IDs have the correct MongoDB format.
// Actual existence/relationship validation is handled in
// the controller because Candidate must belong to Election.
//
// =========================================================

voteSchema.pre("validate", function (next) {
  if (!mongoose.isValidObjectId(this.voter)) {
    return next(new Error("Invalid voter ID."));
  }

  if (!mongoose.isValidObjectId(this.election)) {
    return next(new Error("Invalid election ID."));
  }

  if (!mongoose.isValidObjectId(this.candidate)) {
    return next(new Error("Invalid candidate ID."));
  }

  next();
});

// =========================================================
// MODEL
// =========================================================

const Vote = mongoose.model("Vote", voteSchema);

export default Vote;