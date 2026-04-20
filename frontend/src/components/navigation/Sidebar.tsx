import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "../../utils/cn";

const links = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: (
      <path
        d="M4 13.2c0-.84 0-1.26.16-1.63.14-.33.37-.62.67-.84.34-.25.75-.35 1.56-.56l1.06-.27c.68-.17 1.02-.26 1.35-.43.3-.15.57-.36.79-.61.24-.27.43-.58.8-1.2l.44-.73c.46-.77.7-1.15 1-1.3.26-.13.57-.13.83 0 .3.15.54.53 1 1.3l.44.73c.37.62.56.93.8 1.2.22.25.49.46.79.61.33.17.67.26 1.35.43l1.06.27c.81.21 1.22.31 1.56.56.3.22.53.51.67.84.16.37.16.79.16 1.63V16.8c0 1.12 0 1.68-.22 2.11-.2.39-.52.71-.91.91-.43.22-.99.22-2.11.22H7.24c-1.12 0-1.68 0-2.11-.22a2.22 2.22 0 0 1-.91-.91C4 18.48 4 17.92 4 16.8v-3.6Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )
  },
  {
    to: "/resources",
    label: "Resources",
    icon: (
      <path
        d="M4 7.8c0-1.26 0-1.89.25-2.37.22-.43.57-.78 1-.99C5.73 4.2 6.36 4.2 7.62 4.2h8.76c1.26 0 1.89 0 2.37.24.43.21.78.56 1 .99.25.48.25 1.11.25 2.37v8.4c0 1.26 0 1.89-.25 2.37-.22.43-.57.78-1 .99-.48.24-1.11.24-2.37.24H7.62c-1.26 0-1.89 0-2.37-.24a2.24 2.24 0 0 1-1-.99C4 18.09 4 17.46 4 16.2V7.8Zm5.4 0h5.2M9.4 12h5.2m-5.2 4.2h3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )
  },
  {
    to: "/bookings",
    label: "Bookings",
    icon: (
      <path
        d="M7.2 4.2v2.4m9.6-2.4v2.4M4.8 10.2h14.4m-9.6 4.2h.01m4.19 0h.01M9.6 18.6h.01m4.19 0h.01M7.2 21h9.6c1.68 0 2.52 0 3.16-.33.56-.28 1.02-.74 1.31-1.3.33-.64.33-1.48.33-3.17V9.6c0-1.69 0-2.53-.33-3.17a2.97 2.97 0 0 0-1.31-1.3c-.64-.33-1.48-.33-3.16-.33H7.2c-1.68 0-2.52 0-3.16.33-.56.28-1.02.74-1.31 1.3-.33.64-.33 1.48-.33 3.17v6.6c0 1.69 0 2.53.33 3.17.29.56.75 1.02 1.31 1.3.64.33 1.48.33 3.16.33Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )
  },
  {
    to: "/tickets",
    label: "Tickets",
    icon: (
      <path
        d="M7.8 4.8h8.4c1.68 0 2.52 0 3.16.33.56.28 1.02.74 1.31 1.3.33.64.33 1.48.33 3.17v4.8c0 1.69 0 2.53-.33 3.17-.29.56-.75 1.02-1.31 1.3-.64.33-1.48.33-3.16.33H7.8c-1.68 0-2.52 0-3.16-.33a2.97 2.97 0 0 1-1.31-1.3C3 17.01 3 16.17 3 14.48v-4.8c0-1.69 0-2.53.33-3.17.29-.56.75-1.02 1.31-1.3.64-.33 1.48-.33 3.16-.33Zm0 0V3m8.4 1.8V3M8.4 10.2h7.2m-7.2 3.6h4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )
  },
  {
    to: "/notifications",
    label: "Notifications",
    icon: (
      <path
        d="M12 3.6a4.8 4.8 0 0 0-4.8 4.8v2.33c0 .5-.17.98-.48 1.36l-1.1 1.35c-.53.65-.8.97-.8 1.24 0 .23.09.46.25.62.2.2.62.2 1.47.2h11.88c.85 0 1.27 0 1.47-.2.16-.16.25-.39.25-.62 0-.27-.27-.59-.8-1.24l-1.1-1.35a2.1 2.1 0 0 1-.48-1.36V8.4A4.8 4.8 0 0 0 12 3.6Zm-2.4 15.6a2.4 2.4 0 0 0 4.8 0"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )
  }
];

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

type SidebarLinkProps = {
  to: string;
  label: string;
  icon: ReactNode;
  onClick: () => void;
};

function SidebarLink({ to, label, icon, onClick }: SidebarLinkProps) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition duration-200",
          isActive
            ? "bg-[#2563EB] text-white shadow-lg shadow-blue-900/25"
            : "text-slate-300 hover:bg-slate-800 hover:text-white"
        )
      }
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        {icon}
      </svg>
      <span>{label}</span>
    </NavLink>
  );
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm transition lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#0F172A] px-5 py-6 text-white shadow-2xl shadow-slate-950/30 transition duration-300 lg:sticky lg:top-0 lg:z-20 lg:h-screen lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mb-8 flex items-center justify-between">
          <div className="space-y-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2563EB] text-lg font-semibold text-white shadow-md shadow-blue-800/30">
              SC
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Operations</p>
              <h2 className="text-xl font-semibold tracking-tight">Campus Hub</h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 text-slate-300 transition hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Workspace</p>
          <p className="mt-2 text-sm text-slate-300">
            Manage resources, maintenance requests, technician updates, and notifications.
          </p>
        </div>

        <nav className="mt-6 flex flex-1 flex-col gap-2">
          {links.map((link) => (
            <SidebarLink key={link.to} {...link} onClick={onClose} />
          ))}
        </nav>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-sm font-semibold text-white">Need attention</p>
          <p className="mt-1 text-sm text-slate-400">
            Tickets and alerts stay highlighted with orange badges across the dashboard.
          </p>
        </div>
      </aside>
    </>
  );
}
