import crypto from "crypto";

import SupportChat from "../models/SupportChat.js";

// ======================================================
// GENERATE CONVERSATION ID
// ======================================================

const createConversationId = () => {
  return crypto
    .randomBytes(16)
    .toString("hex");
};

// ======================================================
// SEND MESSAGE
// ======================================================

export const sendMessage = async (
  req,
  res
) => {
  try {
    const {
      message,
      conversationId,
      messageType,
      attachmentUrl,
    } = req.body;

    if (!message?.trim() && !attachmentUrl) {
      return res.status(400).json({
        success: false,
        message:
          "Message or attachment is required.",
      });
    }

    const chat =
      await SupportChat.create({
        conversationId:
          conversationId ||
          createConversationId(),

        user: req.user.id,

        message:
          message?.trim() || "",

        sender:
          req.user.role === "admin"
            ? "admin"
            : "user",

        messageType:
          messageType || "TEXT",

        attachmentUrl:
          attachmentUrl || "",

        isRead: false,
      });

    return res.status(201).json({
      success: true,
      message:
        "Message sent successfully.",
      chat,
    });
  } catch (error) {
    console.error(
      "SEND SUPPORT MESSAGE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to send support message.",
    });
  }
};

// ======================================================
// GET MY CHAT
// ======================================================

export const getMyMessages = async (
  req,
  res
) => {
  try {
    const {
      conversationId,
    } = req.query;

    const filter = {
      user: req.user.id,
    };

    if (conversationId) {
      filter.conversationId =
        conversationId;
    }

    const messages =
      await SupportChat.find(filter)
        .sort({
          createdAt: 1,
        });

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error(
      "GET SUPPORT MESSAGES ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch support messages.",
    });
  }
};