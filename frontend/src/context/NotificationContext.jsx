import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getNotifications,
} from "../api/notificationApi";

export const NotificationContext =
  createContext(null);

const NotificationProvider = ({
  children,
}) => {
  const [
    notifications,
    setNotifications,
  ] = useState([]);

  const [
    unreadCount,
    setUnreadCount,
  ] = useState(0);

  const [
    loading,
    setLoading,
  ] = useState(false);

  // ==========================================
  // FETCH NOTIFICATIONS
  // ==========================================

  const fetchNotifications =
    useCallback(async () => {
      const token =
        localStorage.getItem("token");

      if (!token) {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      setLoading(true);

      try {
        const response =
          await getNotifications();

        /*
          Backend response is expected to
          contain notification data.

          We support multiple common shapes
          to keep the frontend resilient.
        */

        const data =
          response?.data || response;

        const notificationsData =
          data?.notifications || [];

        setNotifications(
          Array.isArray(
            notificationsData
          )
            ? notificationsData
            : []
        );

        // Prefer backend unread count.
        if (
          typeof data?.unreadCount ===
          "number"
        ) {
          setUnreadCount(
            data.unreadCount
          );
        } else {
          // Fallback calculation.
          const unread =
            notificationsData.filter(
              (notification) =>
                !notification?.isRead
            );

          setUnreadCount(
            unread.length
          );
        }
      } catch (error) {
        console.error(
          "NOTIFICATION FETCH ERROR:",
          error
        );

        /*
          Don't logout the user here.
          Notification failure should not
          break the entire application.
        */
      } finally {
        setLoading(false);
      }
    }, []);

  // ==========================================
  // INITIAL FETCH
  // ==========================================

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ==========================================
  // ADD NOTIFICATION LOCALLY
  // ==========================================

  const addNotification =
    useCallback((notification) => {
      if (!notification) {
        return;
      }

      setNotifications(
        (previous) => [
          notification,
          ...previous,
        ]
      );

      if (!notification.isRead) {
        setUnreadCount(
          (previous) => previous + 1
        );
      }
    }, []);

  // ==========================================
  // UPDATE ONE NOTIFICATION
  // ==========================================

  const updateNotification =
    useCallback(
      (notificationId, updates) => {
        if (!notificationId) {
          return;
        }

        setNotifications(
          (previous) =>
            previous.map(
              (notification) =>
                notification._id ===
                  notificationId
                  ? {
                      ...notification,
                      ...updates,
                    }
                  : notification
            )
        );
      },
      []
    );

  // ==========================================
  // REMOVE NOTIFICATION
  // ==========================================

  const removeNotification =
    useCallback(
      (notificationId) => {
        if (!notificationId) {
          return;
        }

        setNotifications(
          (previous) => {
            const notification =
              previous.find(
                (item) =>
                  item._id ===
                  notificationId
              );

            if (
              notification &&
              !notification.isRead
            ) {
              setUnreadCount(
                (count) =>
                  Math.max(0, count - 1)
              );
            }

            return previous.filter(
              (item) =>
                item._id !==
                notificationId
            );
          }
        );
      },
      []
    );

  // ==========================================
  // MARK ALL LOCAL NOTIFICATIONS READ
  // ==========================================

  const markAllLocalAsRead =
    useCallback(() => {
      setNotifications(
        (previous) =>
          previous.map(
            (notification) => ({
              ...notification,
              isRead: true,
              readAt:
                notification.readAt ||
                new Date().toISOString(),
            })
          )
      );

      setUnreadCount(0);
    }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        setNotifications,

        unreadCount,
        setUnreadCount,

        loading,

        fetchNotifications,

        addNotification,
        updateNotification,
        removeNotification,
        markAllLocalAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;

// ==========================================
// CUSTOM HOOK
// ==========================================

export const useNotifications = () => {
  const context =
    useContext(
      NotificationContext
    );

  if (!context) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider."
    );
  }

  return context;
};