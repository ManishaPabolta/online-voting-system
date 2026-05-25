import mongoose from "mongoose";

const votingLinkSchema =
  new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      token: {
        type: String,
        required: true,
      },

      expiresAt: {
        type: Date,
        required: true,
      },

      isActive: {
        type: Boolean,
        default: true,
      },

      isUsed: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

const VotingLink = mongoose.model(
  "VotingLink",
  votingLinkSchema
);

export default VotingLink;