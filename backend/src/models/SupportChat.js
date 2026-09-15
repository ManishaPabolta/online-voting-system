import mongoose from "mongoose";

const supportChatSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

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
      minlength: 1,
      maxlength: 5000,
    },

    sender: {
      type: String,
      enum: ["user", "admin"],
      required: true,
      default: "user",
    },

    messageType: {
      type: String,
      enum: [
        "TEXT",
        "IMAGE",
        "FILE",
        "SYSTEM",
      ],
      default: "TEXT",
    },

    attachmentUrl: {
      type: String,
      trim: true,
      default: "",
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

supportChatSchema.index({
  conversationId: 1,
  createdAt: 1,
});

supportChatSchema.index({
  user: 1,
  createdAt: -1,
});

const SupportChat = mongoose.model(
  "SupportChat",
  supportChatSchema
);

export default SupportChat;