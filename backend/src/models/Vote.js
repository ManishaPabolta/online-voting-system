import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    voter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    election: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
    },

    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
    },
  },
  {
    timestamps: true,
  }
);

const Vote = mongoose.model(
  "Vote",
  voteSchema
);

export default Vote;