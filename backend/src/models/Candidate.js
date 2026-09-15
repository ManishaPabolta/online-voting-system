import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    /* =========================
       ELECTION REFERENCE
    ========================= */

    election: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
      required: true,
      index: true,
    },

    /* =========================
       CANDIDATE BASIC DETAILS
    ========================= */

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    party: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    symbol: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    photo: {
      type: String,
      trim: true,
      default: "",
    },

    /* =========================
       CANDIDATE INFORMATION
    ========================= */

    manifesto: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: "",
    },

    biography: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: "",
    },

    experience: {
      type: String,
      trim: true,
      maxlength: 3000,
      default: "",
    },

    position: {
      type: String,
      trim: true,
      maxlength: 150,
      default: "",
    },

    /* =========================
       VOTE STATISTICS
    ========================= */

    /*
     * Kept for dashboard/cache compatibility.
     *
     * IMPORTANT:
     * Actual election results should be calculated
     * from the Vote collection to avoid inconsistent
     * vote counts.
     */
    voteCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* =========================
       CANDIDATE STATUS
    ========================= */

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

/* =====================================================
   UNIQUE CANDIDATE NAME PER ELECTION
===================================================== */

candidateSchema.index(
  {
    election: 1,
    name: 1,
  },
  {
    unique: true,
  }
);

/* =====================================================
   COMMON QUERY INDEX
===================================================== */

candidateSchema.index({
  election: 1,
  isActive: 1,
});

/* =====================================================
   ADDITIONAL SORTING INDEX
===================================================== */

candidateSchema.index({
  election: 1,
  createdAt: 1,
});

/* =====================================================
   JSON CONFIGURATION
===================================================== */

candidateSchema.set("toJSON", {
  virtuals: true,
});

candidateSchema.set("toObject", {
  virtuals: true,
});

/* =====================================================
   MODEL
===================================================== */

const Candidate = mongoose.model(
  "Candidate",
  candidateSchema
);

export default Candidate;