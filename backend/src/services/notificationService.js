import Notification from "../models/Notification.js";

export const createNotification =
  async ({
    user,
    title,
    message,
  }) => {
    const notification =
      await Notification.create({
        user,
        title,
        message,
      });

    return notification;
  };

export const getUserNotifications =
  async (userId) => {
    return await Notification.find({
      user: userId,
    }).sort({
      createdAt: -1,
    });
  };