import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Trash2,
  Check,
  CheckCheck,
  Loader2,
  Inbox,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  getNotifications,
  markAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../../api/notificationApi";

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await getNotifications();

      const payload = response?.data ?? response;

      const notificationList = Array.isArray(
        payload?.notifications
      )
        ? payload.notifications
        : [];

      setNotifications(notificationList);
    } catch (error) {
      console.error(
        "Notification fetch error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to load notifications"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markHandler = async (id) => {
    if (!id) return;

    try {
      setActionId(id);

      await markAsRead(id);

      setNotifications((previous) =>
        previous.map((notification) =>
          notification._id === id
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );

      toast.success("Notification marked as read");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to mark notification as read"
      );
    } finally {
      setActionId(null);
    }
  };

  const markAllHandler = async () => {
    const unreadExists = notifications.some(
      (notification) => !notification.isRead
    );

    if (!unreadExists) {
      return;
    }

    try {
      setMarkingAll(true);

      await markAllNotificationsAsRead();

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );

      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to mark all notifications as read"
      );
    } finally {
      setMarkingAll(false);
    }
  };

  const deleteHandler = async (id) => {
    if (!id) return;

    try {
      setActionId(id);

      await deleteNotification(id);

      setNotifications((previous) =>
        previous.filter(
          (notification) => notification._id !== id
        )
      );

      toast.success("Notification deleted");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to delete notification"
      );
    } finally {
      setActionId(null);
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="mx-auto w-full max-w-5xl"
    >
      {/* Header */}
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
            <Bell size={25} />
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-white sm:text-3xl">
                Notifications
              </h1>

              {unreadCount > 0 && (
                <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-bold text-emerald-300">
                  {unreadCount} unread
                </span>
              )}
            </div>

            <p className="mt-1 text-sm text-slate-400">
              Stay updated with your voting activity.
            </p>
          </div>
        </div>

        {/* Mark all */}
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllHandler}
            disabled={markingAll}
            className="flex items-center justify-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/15 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {markingAll ? (
              <Loader2
                size={17}
                className="animate-spin"
              />
            ) : (
              <CheckCheck size={17} />
            )}

            {markingAll
              ? "Updating..."
              : "Mark all as read"}
          </button>
        )}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04]">
          <div className="text-center">
            <Loader2
              size={34}
              className="mx-auto animate-spin text-emerald-400"
            />

            <p className="mt-4 text-sm text-slate-500">
              Loading notifications...
            </p>
          </div>
        </div>
      ) : notifications.length === 0 ? (
        /* Empty */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center backdrop-blur-xl sm:p-14"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/5">
            <Inbox
              size={38}
              className="text-slate-600"
            />
          </div>

          <h2 className="mt-6 text-xl font-bold text-white">
            No Notifications
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            You are all caught up. New voting-related updates will
            appear here.
          </p>
        </motion.div>
      ) : (
        /* Notification list */
        <div className="space-y-4">
          <AnimatePresence>
            {notifications.map((notification) => {
              const isUnread = !notification.isRead;
              const isProcessing =
                actionId === notification._id;

              return (
                <motion.div
                  key={notification._id}
                  layout
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                    marginBottom: 0,
                  }}
                  className={`overflow-hidden rounded-3xl border backdrop-blur-xl transition-all ${
                    isUnread
                      ? "border-emerald-400/20 bg-emerald-500/[0.06]"
                      : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                      {/* Content */}
                      <div className="flex min-w-0 gap-4">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                            isUnread
                              ? "bg-emerald-500/15 text-emerald-400"
                              : "bg-white/5 text-slate-500"
                          }`}
                        >
                          <Bell size={20} />
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="font-bold text-white">
                              {notification.title ||
                                "Notification"}
                            </h2>

                            {isUnread && (
                              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
                            )}
                          </div>

                          <p className="mt-2 text-sm leading-6 text-slate-400">
                            {notification.message ||
                              "No message available."}
                          </p>

                          {notification.createdAt && (
                            <p className="mt-3 text-xs text-slate-600">
                              {new Date(
                                notification.createdAt
                              ).toLocaleString("en-IN", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex shrink-0 items-center gap-2 sm:ml-4">
                        {isUnread && (
                          <button
                            type="button"
                            onClick={() =>
                              markHandler(
                                notification._id
                              )
                            }
                            disabled={isProcessing}
                            title="Mark as read"
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-500/10 text-emerald-400 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isProcessing ? (
                              <Loader2
                                size={18}
                                className="animate-spin"
                              />
                            ) : (
                              <Check size={18} />
                            )}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            deleteHandler(
                              notification._id
                            )
                          }
                          disabled={isProcessing}
                          title="Delete notification"
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-400/10 bg-red-500/5 text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isProcessing ? (
                            <Loader2
                              size={18}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default NotificationPanel;