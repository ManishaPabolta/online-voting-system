import express from "express";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================================================
   GET NOTIFICATIONS
   GET /api/notifications
========================================================= */

router.get(
  "/",
  authMiddleware,
  getNotifications
);

/* =========================================================
   MARK ALL NOTIFICATIONS AS READ
   PATCH /api/notifications/read-all
========================================================= */

router.patch(
  "/read-all",
  authMiddleware,
  markAllNotificationsAsRead
);

/* =========================================================
   MARK ONE NOTIFICATION AS READ
   PATCH /api/notifications/:id/read
========================================================= */

router.patch(
  "/:id/read",
  authMiddleware,
  markNotificationAsRead
);

/* =========================================================
   DELETE NOTIFICATION
   DELETE /api/notifications/:id
========================================================= */

router.delete(
  "/:id",
  authMiddleware,
  deleteNotification
);

export default router;