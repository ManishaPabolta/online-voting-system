import mongoose from "mongoose";
import Notification from "../models/Notification.js";

/* ======================================================
   HELPERS
====================================================== */

const isValidObjectId = (id) => {
  return mongoose.isValidObjectId(id);
};

const getUserId = (req) => {
  return req.user?._id || req.user?.id;
};

/* ======================================================
   GET NOTIFICATIONS
   GET /api/notifications
====================================================== */

export const getNotifications = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId || !isValidObjectId(userId)) {
      return res.status(401).json({
        success: false,
        message: "Invalid authenticated user.",
      });
    }

    /* -----------------------------
       LIMIT
    ----------------------------- */

    let limit = Number(req.query.limit) || 30;

    if (!Number.isFinite(limit) || limit < 1) {
      limit = 30;
    }

    limit = Math.min(Math.floor(limit), 100);

    /* -----------------------------
       FETCH NOTIFICATIONS
    ----------------------------- */

    const notifications = await Notification.find({
      user: userId,
    })
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
      .limit(limit)
      .lean();

    /* -----------------------------
       UNREAD COUNT
    ----------------------------- */

    const unreadCount =
      await Notification.countDocuments({
        user: userId,
        isRead: false,
      });

    return res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error(
      "GET NOTIFICATIONS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch notifications.",
    });
  }
};

/* ======================================================
   MARK ONE NOTIFICATION AS READ
   PATCH /api/notifications/:id/read
====================================================== */

export const markNotificationAsRead = async (
  req,
  res
) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    if (!userId || !isValidObjectId(userId)) {
      return res.status(401).json({
        success: false,
        message: "Invalid authenticated user.",
      });
    }

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID.",
      });
    }

    /* -----------------------------
       FIND USER'S NOTIFICATION
    ----------------------------- */

    const notification =
      await Notification.findOne({
        _id: id,
        user: userId,
      });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    /* -----------------------------
       ALREADY READ
    ----------------------------- */

    if (!notification.isRead) {
      notification.isRead = true;
      notification.readAt = new Date();

      await notification.save();
    }

    return res.status(200).json({
      success: true,
      message:
        "Notification marked as read.",
      notification,
    });
  } catch (error) {
    console.error(
      "MARK NOTIFICATION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update notification.",
    });
  }
};

/* ======================================================
   MARK ALL NOTIFICATIONS AS READ
   PATCH /api/notifications/read-all
====================================================== */

export const markAllNotificationsAsRead = async (
  req,
  res
) => {
  try {
    const userId = getUserId(req);

    if (!userId || !isValidObjectId(userId)) {
      return res.status(401).json({
        success: false,
        message: "Invalid authenticated user.",
      });
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

    return res.status(200).json({
      success: true,
      message:
        "All notifications marked as read.",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error(
      "MARK ALL NOTIFICATIONS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update notifications.",
    });
  }
};

/* ======================================================
   DELETE NOTIFICATION
   DELETE /api/notifications/:id
====================================================== */

export const deleteNotification = async (
  req,
  res
) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    if (!userId || !isValidObjectId(userId)) {
      return res.status(401).json({
        success: false,
        message: "Invalid authenticated user.",
      });
    }

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID.",
      });
    }

    /*
     * user condition is extremely important.
     *
     * A logged-in user can delete ONLY their own
     * notification.
     */

    const notification =
      await Notification.findOneAndDelete({
        _id: id,
        user: userId,
      });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Notification deleted successfully.",
      deletedNotificationId: id,
    });
  } catch (error) {
    console.error(
      "DELETE NOTIFICATION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to delete notification.",
    });
  }
};