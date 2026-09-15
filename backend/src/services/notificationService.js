import Notification from "../models/Notification.js";

// ======================================================
// CREATE NOTIFICATION
// ======================================================

export const createNotification = async ({
  user,
  title,
  message,
  type = "SYSTEM",
  relatedElection = null,
  relatedCandidate = null,
  actionUrl = "",
  priority = "NORMAL",
  expiresAt = null,
}) => {
  if (!user) {
    throw new Error("Notification user is required.");
  }

  if (!title) {
    throw new Error("Notification title is required.");
  }

  if (!message) {
    throw new Error(
      "Notification message is required."
    );
  }

  const notification =
    await Notification.create({
      user,
      title: String(title).trim(),
      message: String(message).trim(),
      type,
      relatedElection,
      relatedCandidate,
      actionUrl: String(actionUrl || "").trim(),
      priority,
      expiresAt,
    });

  return notification;
};

// ======================================================
// CREATE MULTIPLE NOTIFICATIONS
// ======================================================

export const createBulkNotifications = async (
  notifications
) => {
  if (
    !Array.isArray(notifications) ||
    notifications.length === 0
  ) {
    return [];
  }

  return Notification.insertMany(
    notifications
  );
};

// ======================================================
// GET USER NOTIFICATIONS
// ======================================================

export const getUserNotifications = async (
  userId,
  {
    limit = 50,
    unreadOnly = false,
  } = {}
) => {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  const safeLimit = Math.min(
    Math.max(Number(limit) || 50, 1),
    100
  );

  const filter = {
    user: userId,
  };

  if (unreadOnly) {
    filter.isRead = false;
  }

  return Notification.find(filter)
    .populate(
      "relatedElection",
      "title status startDate endDate"
    )
    .populate(
      "relatedCandidate",
      "name party symbol photo"
    )
    .sort({
      createdAt: -1,
    })
    .limit(safeLimit)
    .lean();
};

// ======================================================
// UNREAD COUNT
// ======================================================

export const getUnreadNotificationCount = async (
  userId
) => {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  return Notification.countDocuments({
    user: userId,
    isRead: false,
  });
};

// ======================================================
// MARK ONE AS READ
// ======================================================

export const markNotificationRead = async (
  notificationId,
  userId
) => {
  const notification =
    await Notification.findOne({
      _id: notificationId,
      user: userId,
    });

  if (!notification) {
    throw new Error("Notification not found.");
  }

  if (!notification.isRead) {
    notification.isRead = true;
    notification.readAt = new Date();

    await notification.save();
  }

  return notification;
};

// ======================================================
// MARK ALL AS READ
// ======================================================

export const markAllNotificationsRead = async (
  userId
) => {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  const result =
    await Notification.updateMany(
      {
        user: userId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
          readAt: new Date(),
        },
      }
    );

  return result;
};

// ======================================================
// DELETE NOTIFICATION
// ======================================================

export const deleteUserNotification = async (
  notificationId,
  userId
) => {
  return Notification.findOneAndDelete({
    _id: notificationId,
    user: userId,
  });
};