import SupportChat from "../models/SupportChat.js";

export const sendMessage = async (req, res) => {
  try {
    const chat = await SupportChat.create({
      user: req.user.id,
      message: req.body.message,
    });

    res.status(201).json({
      success: true,
      chat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};