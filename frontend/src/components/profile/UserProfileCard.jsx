import {
  useEffect,
  useState,
} from "react";

import {
  Bell,
  Trash2,
  CheckCircle,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  getNotifications,
  markAsRead,
  deleteNotification,
} from "../../api/notificationApi";

const NotificationPanel = () => {
  const [
    notifications,
    setNotifications,
  ] = useState([]);

  const fetchNotifications =
    async () => {
      try {
        const response =
          await getNotifications();

        setNotifications(
          response.notifications
        );
      } catch (error) {
        toast.error(
          "Failed to load notifications"
        );
      }
    };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markHandler =
    async (id) => {
      try {
        await markAsRead(id);

        setNotifications(
          notifications.map(
            (item) =>
              item._id === id
                ? {
                    ...item,
                    isRead: true,
                  }
                : item
          )
        );

        toast.success(
          "Marked as read"
        );
      } catch (error) {
        toast.error(
          "Update failed"
        );
      }
    };

  const deleteHandler =
    async (id) => {
      try {
        await deleteNotification(
          id
        );

        setNotifications(
          notifications.filter(
            (item) =>
              item._id !== id
          )
        );

        toast.success(
          "Notification deleted"
        );
      } catch (error) {
        toast.error(
          "Delete failed"
        );
      }
    };

  return (
    <div className="max-w-5xl mx-auto">

      <div className="flex items-center gap-3 mb-8">

        <div className="bg-blue-600 p-3 rounded-2xl">
          <Bell size={28} />
        </div>

        <div>

          <h1 className="text-4xl font-bold">
            Notifications
          </h1>

          <p className="text-gray-400 mt-1">
            Real-time voting
            updates
          </p>

        </div>

      </div>

      <div className="space-y-5">

        {notifications.length >
        0 ? (
          notifications.map(
            (
              notification
            ) => (
              <div
                key={
                  notification._id
                }
                className={`p-6 rounded-3xl border shadow-2xl transition-all duration-300
                ${
                  notification.isRead
                    ? "bg-white/5 border-white/5"
                    : "bg-blue-500/10 border-blue-500/30"
                }`}
              >

                <div className="flex items-start justify-between gap-5">

                  <div>

                    <h2 className="text-xl font-bold">
                      {
                        notification.title
                      }
                    </h2>

                    <p className="text-gray-300 mt-2">
                      {
                        notification.message
                      }
                    </p>

                    <p className="text-sm text-gray-500 mt-4">
                      {new Date(
                        notification.createdAt
                      ).toLocaleString()}
                    </p>

                  </div>

                  <div className="flex items-center gap-3">

                    {!notification.isRead && (
                      <button
                        onClick={() =>
                          markHandler(
                            notification._id
                          )
                        }
                        className="bg-green-600 hover:bg-green-700 p-3 rounded-xl transition"
                      >
                        <CheckCircle
                          size={
                            20
                          }
                        />
                      </button>
                    )}

                    <button
                      onClick={() =>
                        deleteHandler(
                          notification._id
                        )
                      }
                      className="bg-red-600 hover:bg-red-700 p-3 rounded-xl transition"
                    >
                      <Trash2
                        size={20}
                      />
                    </button>

                  </div>

                </div>

              </div>
            )
          )
        ) : (
          <div className="bg-white/10 border border-white/10 rounded-3xl p-10 text-center">

            <Bell
              size={60}
              className="mx-auto text-gray-500"
            />

            <h2 className="text-2xl font-bold mt-5">
              No Notifications
            </h2>

            <p className="text-gray-400 mt-2">
              You are all caught up
            </p>

          </div>
        )}

      </div>

    </div>
  );
};
export default NotificationPanel;