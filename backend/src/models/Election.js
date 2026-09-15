import mongoose from "mongoose";

const electionSchema = new mongoose.Schema(
  {
    /* =========================
       BASIC ELECTION DETAILS
    ========================= */

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 10000,
      default: "",
    },

    electionType: {
      type: String,
      enum: [
        "PRESIDENTIAL",
        "PARLIAMENTARY",
        "ASSEMBLY",
        "LOCAL",
        "COLLEGE",
        "ORGANIZATION",
        "OTHER",
      ],
      default: "OTHER",
      index: true,
    },

    /* =========================
       ELECTION TIMING
    ========================= */

    startDate: {
      type: Date,
      required: true,
      index: true,
    },

    endDate: {
      type: Date,
      required: true,
      index: true,
    },

    /* =========================
       ELECTION STATUS
    ========================= */

    status: {
      type: String,
      enum: [
        "DRAFT",
        "UPCOMING",
        "LIVE",
        "COMPLETED",
        "CANCELLED",
      ],
      default: "DRAFT",
      index: true,
    },

    /* =========================
       CANDIDATES
    ========================= */

    candidates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Candidate",
      },
    ],

    /* =========================
       CREATOR
    ========================= */

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* =========================
       VOTE STATISTICS
    ========================= */

    totalVotes: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalEligibleVoters: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* =========================
       PUBLICATION CONTROLS
    ========================= */

    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },

    isResultsPublished: {
      type: Boolean,
      default: false,
      index: true,
    },

    allowResultsBeforeEnd: {
      type: Boolean,
      default: false,
    },

    /* =========================
       UI / PRESENTATION
    ========================= */

    bannerImage: {
      type: String,
      trim: true,
      default: "",
    },

    instructions: {
      type: [String],
      default: [],
    },

    /* =========================
       EXTRA DATA
    ========================= */

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

/* =====================================================
   DATE VALIDATION
===================================================== */

electionSchema.pre("validate", function (next) {
  if (!this.startDate || !this.endDate) {
    return next();
  }

  if (this.endDate <= this.startDate) {
    return next(
      new Error("Election end date must be after start date.")
    );
  }

  next();
});

/* =====================================================
   AUTOMATIC STATUS VALIDATION
===================================================== */

electionSchema.pre("save", function (next) {
  /*
   * Do not automatically modify cancelled elections.
   */
  if (this.status === "CANCELLED") {
    return next();
  }

  /*
   * Draft elections stay draft until published.
   */
  if (!this.isPublished) {
    this.status = "DRAFT";
    return next();
  }

  /*
   * Published election status is calculated
   * from start/end dates.
   */
  const now = new Date();

  if (now < this.startDate) {
    this.status = "UPCOMING";
  } else if (now >= this.startDate && now < this.endDate) {
    this.status = "LIVE";
  } else if (now >= this.endDate) {
    this.status = "COMPLETED";
  }

  next();
});

/* =====================================================
   VIRTUAL CURRENT STATE
===================================================== */

electionSchema.virtual("currentState").get(function () {
  const now = new Date();

  if (this.status === "CANCELLED") {
    return "CANCELLED";
  }

  if (!this.isPublished || this.status === "DRAFT") {
    return "DRAFT";
  }

  if (now < this.startDate) {
    return "UPCOMING";
  }

  if (now >= this.startDate && now < this.endDate) {
    return "LIVE";
  }

  if (now >= this.endDate) {
    return "COMPLETED";
  }

  return this.status;
});

/* =====================================================
   HELPER VIRTUALS
===================================================== */

electionSchema.virtual("durationInMinutes").get(function () {
  if (!this.startDate || !this.endDate) {
    return 0;
  }

  return Math.max(
    0,
    Math.floor(
      (this.endDate.getTime() - this.startDate.getTime()) /
        (1000 * 60)
    )
  );
});

electionSchema.virtual("isCurrentlyLive").get(function () {
  const now = new Date();

  return (
    this.isPublished &&
    this.status === "LIVE" &&
    now >= this.startDate &&
    now < this.endDate
  );
});

/* =====================================================
   INDEXES
===================================================== */

electionSchema.index({
  status: 1,
  startDate: 1,
  endDate: 1,
});

electionSchema.index({
  createdBy: 1,
  createdAt: -1,
});

electionSchema.index({
  isPublished: 1,
  status: 1,
});

/* =====================================================
   JSON / OBJECT CONFIGURATION
===================================================== */

electionSchema.set("toJSON", {
  virtuals: true,
});

electionSchema.set("toObject", {
  virtuals: true,
});

/* =====================================================
   MODEL
===================================================== */

const Election = mongoose.model(
  "Election",
  electionSchema
);

export default Election;