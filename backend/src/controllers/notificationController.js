import Notification from "../models/Notification.js";

export const getNotifications =
  async (req, res) => {

    try {

      const notifications =
        await Notification.find({
          user: req.user.id,
        }).sort({
          createdAt: -1,
        });

      return res.status(200).json({
        success: true,
        notifications,
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };