import api from "../api/axios";

/*
 * =========================
 * GET ALL NOTIFICATIONS
 * =========================
 */

export const getNotifications = async () => {
  const response = await api.get("/notifications");

  return response.data;
};


/*
 * =========================
 * GET UNREAD NOTIFICATIONS
 * =========================
 */

export const getUnreadNotifications = async () => {
  const response = await api.get(
    "/notifications/unread"
  );

  return response.data;
};


/*
 * =========================
 * GET UNREAD COUNT
 * =========================
 */

export const getUnreadCount = async () => {
  const response = await api.get(
    "/notifications/unread-count"
  );

  return response.data;
};


/*
 * =========================
 * MARK ONE NOTIFICATION AS READ
 * =========================
 */

export const markNotificationAsRead = async (
  notificationId
) => {
  const response = await api.put(
    `/notifications/${notificationId}/read`
  );

  return response.data;
};


/*
 * =========================
 * MARK ALL NOTIFICATIONS AS READ
 * =========================
 */

export const markAllNotificationsAsRead = async () => {
  const response = await api.put(
    "/notifications/read-all"
  );

  return response.data;
};
