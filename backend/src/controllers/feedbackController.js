import Feedback from "../models/Feedback.js";

// ======================================================
// CREATE FEEDBACK
// ======================================================

export const createFeedback = async (
  req,
  res
) => {
  try {
    const {
      message,
      rating,
      category,
    } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Feedback message is required.",
      });
    }

    if (
      rating !== undefined &&
      (Number(rating) < 1 ||
        Number(rating) > 5)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Rating must be between 1 and 5.",
      });
    }

    const feedback =
      await Feedback.create({
        user: req.user.id,

        message: message.trim(),

        rating:
          rating !== undefined
            ? Number(rating)
            : undefined,

        category:
          category || "GENERAL",
      });

    return res.status(201).json({
      success: true,
      message:
        "Thank you for your feedback.",
      feedback,
    });
  } catch (error) {
    console.error(
      "CREATE FEEDBACK ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to submit feedback.",
    });
  }
};

// ======================================================
// GET FEEDBACK
// ======================================================

export const getFeedback = async (
  req,
  res
) => {
  try {
    const filter =
      req.user.role === "admin"
        ? {}
        : {
            user: req.user.id,
          };

    const feedback =
      await Feedback.find(filter)
        .populate(
          "user",
          "name email"
        )
        .populate(
          "respondedBy",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error(
      "GET FEEDBACK ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch feedback.",
    });
  }
};

// ======================================================
// RESPOND TO FEEDBACK
// ======================================================

export const respondToFeedback = async (
  req,
  res
) => {
  try {
    const {
      adminResponse,
      status,
    } = req.body;

    if (!adminResponse?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Admin response is required.",
      });
    }

    const feedback =
      await Feedback.findById(
        req.params.id
      );

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found.",
      });
    }

    feedback.adminResponse =
      adminResponse.trim();

    feedback.respondedBy =
      req.user.id;

    feedback.respondedAt = new Date();

    feedback.status =
      status || "REVIEWED";

    await feedback.save();

    return res.status(200).json({
      success: true,
      message:
        "Feedback response saved.",
      feedback,
    });
  } catch (error) {
    console.error(
      "RESPOND FEEDBACK ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to respond to feedback.",
    });
  }
};