import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { UserRole } from "../../types/auth";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/resources", label: "Resources" },
  { to: "/bookings", label: "Bookings" },
  { to: "/tickets", label: "Tickets" },
  { to: "/notifications", label: "Notifications" },
  { to: "/admin", label: "Admin", roles: ["ADMIN"] as UserRole[] }
];

export function Sidebar() {
  const { hasRole, user } = useAuth();

  return (
    <aside className="sidebar">
      <div>
        <p className="brand-kicker">SCOH</p>
        <h2>Campus Hub</h2>
        {user && <span className="role-pill">{user.role}</span>}
      </div>
      <nav className="sidebar-nav">
        {links.filter((link) => hasRole(link.roles)).map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
