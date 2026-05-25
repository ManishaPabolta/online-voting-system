import Feedback from "../models/Feedback.js";

export const createFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.create({
      user: req.user.id,
      message: req.body.message,
    });

    res.status(201).json({
      success: true,
      feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};