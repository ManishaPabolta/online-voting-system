import mongoose from "mongoose";

const votingLinkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    election: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
      required: true,
      index: true,
    },

    token: {
      type: String,
      required: true,
      unique: true,
      select: false,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isUsed: {
      type: Boolean,
      default: false,
      index: true,
    },

    usedAt: {
      type: Date,
      default: null,
    },

    ipAddress: {
      type: String,
      default: "",
      select: false,
    },

    userAgent: {
      type: String,
      default: "",
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

/*
 * Automatically remove expired voting links
 * from MongoDB.
 */
votingLinkSchema.index(
  {
    expiresAt: 1,
  },
  {
    expireAfterSeconds: 0,
  }
);

votingLinkSchema.index({
  user: 1,
  election: 1,
  isActive: 1,
});

const VotingLink = mongoose.model(
  "VotingLink",
  votingLinkSchema
);

export default VotingLink;