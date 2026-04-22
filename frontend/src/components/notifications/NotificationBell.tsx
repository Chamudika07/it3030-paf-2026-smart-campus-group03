import { useEffect, useMemo, useState } from "react";
import {
  fetchNotifications,
  fetchUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead
} from "../../api/notificationApi";
import type { AppNotification } from "../../types/notification";
import { useAuth } from "../../hooks/useAuth";

function formatNotificationTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export function NotificationBell() {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unreadLabel = useMemo(() => unreadCount > 9 ? "9+" : String(unreadCount), [unreadCount]);

  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    void refreshNotifications();
  }, [isAuthenticated]);

  async function refreshNotifications() {
    setLoading(true);
    setError(null);
    try {
      const [nextNotifications, nextCount] = await Promise.all([
        fetchNotifications(),
        fetchUnreadNotificationCount()
      ]);
      setNotifications(nextNotifications);
      setUnreadCount(nextCount);
    } catch {
      setError("Could not load notifications.");
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkAsRead(notificationId: number) {
    const updated = await markNotificationAsRead(notificationId);
    setNotifications((current) =>
      current.map((notification) => notification.id === updated.id ? updated : notification)
    );
    setUnreadCount((current) => Math.max(current - 1, 0));
  }

  async function handleMarkAllAsRead() {
    await markAllNotificationsAsRead();
    setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));
    setUnreadCount(0);
  }

  return (
    <div className="notification-shell">
      <button
        className="icon-button notification-button"
        type="button"
        aria-label="Notifications"
        onClick={() => setOpen((current) => !current)}
      >
        <span aria-hidden="true">N</span>
        {unreadCount > 0 && <span className="notification-badge">{unreadLabel}</span>}
      </button>

      {open && (
        <div className="notification-panel">
          <div className="notification-panel-header">
            <div>
              <p className="eyebrow">Notifications</p>
              <h3>Campus updates</h3>
            </div>
            <button
              className="button-secondary compact-button"
              type="button"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark all read
            </button>
          </div>

          {loading && <p className="muted-text">Loading notifications...</p>}
          {error && <p className="panel-inline error-panel">{error}</p>}
          {!loading && !error && notifications.length === 0 && (
            <p className="empty-state">No notifications yet.</p>
          )}

          <div className="notification-list">
            {notifications.map((notification) => (
              <article
                key={notification.id}
                className={notification.read ? "notification-item" : "notification-item unread"}
              >
                <div>
                  <h4>{notification.title}</h4>
                  <p>{notification.message}</p>
                  <span>{formatNotificationTime(notification.createdAt)}</span>
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
        </div>
      )}
    </div>
  );
}
