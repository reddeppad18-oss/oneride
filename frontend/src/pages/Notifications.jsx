import { useEffect, useState } from "react";
import api from "../api/axios";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    try {
      setError("");

      const response = await api.get("/notifications");

      setNotifications(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (err) {
      console.error(
        "Failed to load notifications:",
        err
      );

      setError("Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.put(
        `/notifications/${notificationId}/read`
      );

      setNotifications((previous) =>
        previous.map((notification) =>
          notification.id === notificationId
            ? {
                ...notification,
                read: true,
              }
            : notification
        )
      );
    } catch (err) {
      console.error(
        "Failed to mark notification as read:",
        err
      );
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put(
        "/notifications/read-all"
      );

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
    } catch (err) {
      console.error(
        "Failed to mark all notifications as read:",
        err
      );
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <div className="notifications-page">

      <div className="page-header">
        <div>
          <h1>Notifications</h1>
          <p>
            Stay updated with your Alrides activity.
          </p>
        </div>

        {notifications.some(
          (notification) => !notification.read
        ) && (
          <button
            type="button"
            onClick={markAllAsRead}
          >
            Mark all as read
          </button>
        )}
      </div>

      {loading && (
        <div className="empty-state">
          <p>Loading notifications...</p>
        </div>
      )}

      {!loading && error && (
        <div className="empty-state">
          <p>{error}</p>

          <button
            type="button"
            onClick={loadNotifications}
          >
            Try Again
          </button>
        </div>
      )}

      {!loading &&
        !error &&
        notifications.length === 0 && (
          <div className="empty-state">
            <div style={{ fontSize: "40px" }}>
              🔔
            </div>

            <h3>No notifications yet</h3>

            <p>
              You will see booking and ride updates here.
            </p>
          </div>
        )}

      {!loading &&
        !error &&
        notifications.length > 0 && (
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={
                  notification.read
                    ? "notification-item"
                    : "notification-item unread"
                }
                onClick={() => {
                  if (!notification.read) {
                    markAsRead(notification.id);
                  }
                }}
              >
                <div className="notification-icon">
                  🔔
                </div>

                <div className="notification-content">
                  <h3>
                    {notification.title}
                  </h3>

                  <p>
                    {notification.message}
                  </p>

                  {notification.createdAt && (
                    <small>
                      {new Date(
                        notification.createdAt
                      ).toLocaleString()}
                    </small>
                  )}
                </div>

                {!notification.read && (
                  <span className="notification-unread-dot" />
                )}
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

export default Notifications;
