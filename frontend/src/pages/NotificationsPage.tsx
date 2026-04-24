import { useEffect, useState } from "react";
import {
  fetchNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead
} from "../api/notificationApi";
import type { AppNotification } from "../types/notification";

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadNotifications();
  }, []);

  async function loadNotifications() {
    setLoading(true);
    setError(null);
    try {
      setNotifications(await fetchNotifications());
    } catch {
      setError("Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkAsRead(notificationId: number) {
    const updated = await markNotificationAsRead(notificationId);
    setNotifications((current) =>
      current.map((notification) => notification.id === updated.id ? updated : notification)
    );
  }

  async function handleMarkAllAsRead() {
    await markAllNotificationsAsRead();
    setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));
  }

  return (
    <section className="panel stack">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Member 4 ownership</p>
          <h2>Notifications</h2>
          <p className="muted-text">Review booking decisions, ticket updates, and operational alerts.</p>
        </div>
        <button
          className="button-secondary"
          type="button"
          onClick={handleMarkAllAsRead}
          disabled={!notifications.some((notification) => !notification.read)}
        >
          Mark all read
        </button>
      </div>

      {loading && <p className="muted-text">Loading notifications...</p>}
      {error && <p className="panel-inline error-panel">{error}</p>}
      {!loading && !error && notifications.length === 0 && (
        <p className="empty-state">No notifications have been created for your account yet.</p>
      )}

      <div className="notification-page-list">
        {notifications.map((notification) => (
          <article
            key={notification.id}
            className={notification.read ? "notification-row" : "notification-row unread"}
          >
            <div>
              <h3>{notification.title}</h3>
              <p>{notification.message}</p>
              <span>{new Date(notification.createdAt).toLocaleString()}</span>
            </div>
            {!notification.read && (
              <button
                className="button-secondary compact-button"
                type="button"
                onClick={() => handleMarkAsRead(notification.id)}
              >
                Read
              </button>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
