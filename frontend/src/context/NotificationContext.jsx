import {
  createContext,
  useEffect,
  useState,
} from "react";

import {
  getNotifications,
} from "../api/notificationApi";

export const NotificationContext =
  createContext();

const NotificationProvider =
  ({ children }) => {
    const [
      notifications,
      setNotifications,
    ] = useState([]);

    const [
      unreadCount,
      setUnreadCount,
    ] = useState(0);

    const fetchNotifications =
      async () => {
        try {
          const token =
            localStorage.getItem(
              "token"
            );

          if (!token) return;

          const response =
            await getNotifications();

          const notificationsData =
            response?.notifications ||
            [];

          setNotifications(
            notificationsData
          );

          const unread =
            notificationsData.filter(
              (
                notification
              ) =>
                !notification.isRead
            );

          setUnreadCount(
            unread.length
          );
        } catch (error) {
          console.log(error);
        }
      };

    useEffect(() => {
      fetchNotifications();
    }, []);

    return (
      <NotificationContext.Provider
        value={{
          notifications,
          setNotifications,
          unreadCount,
          fetchNotifications,
        }}
      >
        {children}
      </NotificationContext.Provider>
    );
  };

export default NotificationProvider;