import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    election: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
      required: true,
      index: true,
    },

    totalVotes: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalCandidates: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalEligibleVoters: {
      type: Number,
      default: 0,
      min: 0,
    },

    voterTurnout: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      default: null,
    },

    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reportFile: {
      type: String,
      trim: true,
      default: "",
    },

    reportFormat: {
      type: String,
      enum: ["PDF", "CSV", "EXCEL", "JSON"],
      default: "PDF",
    },

    status: {
      type: String,
      enum: ["GENERATING", "COMPLETED", "FAILED"],
      default: "GENERATING",
    },

    generatedAt: {
      type: Date,
      default: null,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.index({
  election: 1,
  createdAt: -1,
});

const Report = mongoose.model(
  "Report",
  reportSchema
);

export default Report;