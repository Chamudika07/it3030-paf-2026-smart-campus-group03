import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/resources", label: "Resources" },
  { to: "/bookings", label: "Bookings" },
  { to: "/tickets", label: "Tickets" },
  { to: "/notifications", label: "Notifications" }
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div>
        <p className="brand-kicker">SCOH</p>
        <h2>Campus Hub</h2>
      </div>
      <nav className="sidebar-nav">
        {links.map((link) => (
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

