import mongoose from "mongoose";

const supportChatSchema =
  new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      message: {
        type: String,
        required: true,
      },

      sender: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
      },
    },
    {
      timestamps: true,
    }
  );

const SupportChat = mongoose.model(
  "SupportChat",
  supportChatSchema
);

export default SupportChat;