import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

type NavbarProps = {
  onToggleSidebar: () => void;
};

const topLinks = [
  { to: "/dashboard", label: "Overview" },
  { to: "/tickets", label: "Tickets" },
  { to: "/resources", label: "Resources" }
];

export function Navbar({ onToggleSidebar }: NavbarProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 mb-6 rounded-2xl border border-[#E2E8F0] bg-white/90 px-4 py-4 shadow-md shadow-slate-200/40 backdrop-blur lg:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#E2E8F0] text-[#334155] transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#DBEAFE] lg:hidden"
            aria-label="Toggle sidebar"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </button>

          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#94A3B8]">
              Smart Campus Operations Hub
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-[#0F172A]">Team Dashboard</h1>
          </div>
        </div>

        <nav className="hidden items-center gap-2 md:flex">
          {topLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                [
                  "rounded-xl px-3 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-[#DBEAFE] text-[#1D4ED8]"
                    : "text-[#334155] hover:bg-slate-100 hover:text-[#0F172A]"
                ].join(" ")
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center justify-between gap-3 lg:justify-end">
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DBEAFE] text-sm font-semibold text-[#1D4ED8]">
              {(user?.name ?? "Guest")
                .split(" ")
                .map((part) => part.charAt(0))
                .join("")
                .slice(0, 2)}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0F172A]">{user?.name ?? "Guest"}</p>
              <div className="flex items-center gap-2">
                <p className="text-xs uppercase tracking-[0.18em] text-[#94A3B8]">
                  {user?.role ?? "No role"}
                </p>
                <Badge tone="orange">3 alerts</Badge>
              </div>
            </div>
          </div>

          <Button type="button" variant="secondary" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
