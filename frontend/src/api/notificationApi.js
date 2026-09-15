import API from "./axios";

// ==========================================
// GET NOTIFICATIONS
// ==========================================

export const getNotifications = async () => {
  const response = await API.get("/notifications");
  return response.data;
};

// ==========================================
// MARK ONE AS READ
// ==========================================

export const markAsRead = async (id) => {
  const response = await API.patch(`/notifications/${id}/read`);
  return response.data;
};

// ==========================================
// MARK ALL AS READ
// ==========================================

export const markAllNotificationsAsRead = async () => {
  const response = await API.patch("/notifications/read-all");
  return response.data;
};

// ==========================================
// DELETE NOTIFICATION
// ==========================================

export const deleteNotification = async (id) => {
  const response = await API.delete(`/notifications/${id}`);
  return response.data;
};