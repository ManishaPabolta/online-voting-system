import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 3000,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: false,
    },

    category: {
      type: String,
      enum: [
        "GENERAL",
        "VOTING",
        "ELECTION",
        "WEBSITE",
        "SUPPORT",
        "SECURITY",
        "OTHER",
      ],
      default: "GENERAL",
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "REVIEWED",
        "RESOLVED",
      ],
      default: "PENDING",
      index: true,
    },

    adminResponse: {
      type: String,
      trim: true,
      maxlength: 3000,
      default: "",
    },

    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    respondedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

feedbackSchema.index({
  user: 1,
  createdAt: -1,
});

feedbackSchema.index({
  status: 1,
  createdAt: -1,
});

const Feedback = mongoose.model(
  "Feedback",
  feedbackSchema
);

export default Feedback;