import mongoose from "mongoose";

const reportSchema =
  new mongoose.Schema(
    {
      election: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Election",
      },

      totalVotes: {
        type: Number,
        default: 0,
      },

      totalCandidates: {
        type: Number,
        default: 0,
      },

      generatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      reportFile: {
        type: String,
      },
    },
    {
      timestamps: true,
    }
  );

const Report = mongoose.model(
  "Report",
  reportSchema
);

export default Report;