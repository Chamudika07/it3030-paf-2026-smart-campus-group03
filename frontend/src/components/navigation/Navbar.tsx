import { useAuth } from "../../hooks/useAuth";
import { NotificationBell } from "../notifications/NotificationBell";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Smart Campus Operations Hub</p>
        <h1>Team Dashboard</h1>
      </div>
      <div className="topbar-actions">
        <NotificationBell />
        <div className="session-card">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="" className="avatar" />
          ) : (
            <div className="avatar avatar-fallback">{user?.name?.charAt(0) ?? "U"}</div>
          )}
          <div>
            <strong>{user?.name ?? "Guest"}</strong>
            <span>{user?.email}</span>
            <small>{user?.role}</small>
          </div>
        </div>
        <button className="button-secondary" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}
