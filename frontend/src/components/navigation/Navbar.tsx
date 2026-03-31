import { useAuth } from "../../hooks/useAuth";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Smart Campus Operations Hub</p>
        <h1>Team Dashboard</h1>
      </div>
      <div className="topbar-actions">
        <span>{user?.name ?? "Guest"}</span>
        <button onClick={logout}>Logout</button>
      </div>
    </header>
  );
}

