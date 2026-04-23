interface ResourceStatusBadgeProps {
  active: boolean;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  showPulse?: boolean;
}

export function ResourceStatusBadge({
  active,
  size = "md",
  showIcon = true,
  showPulse = true,
}: ResourceStatusBadgeProps) {
  const label = active ? "Active" : "Inactive";

  return (
    <span
      className={`rsb rsb--${active ? "active" : "inactive"} rsb--${size}`}
      title={active ? "This resource is available" : "This resource is currently out of service"}
      aria-label={`Status: ${label}`}
    >
      {showIcon && (
        <span className="rsb__icon" aria-hidden="true">
          {active ? "●" : "○"}
        </span>
      )}
      {showPulse && active && <span className="rsb__pulse" aria-hidden="true" />}
      <span className="rsb__label">{label}</span>

      <style>{`
        .rsb {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-weight: 700;
          border-radius: 999px;
          white-space: nowrap;
          letter-spacing: 0.03em;
          border: 1.5px solid transparent;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          cursor: default;
          user-select: none;
        }

        .rsb:hover {
          transform: scale(1.04);
        }

        /* ── Sizes ─────────────────────────────────── */
        .rsb--sm {
          font-size: 0.7rem;
          padding: 0.2rem 0.55rem;
        }
        .rsb--md {
          font-size: 0.8rem;
          padding: 0.3rem 0.8rem;
        }
        .rsb--lg {
          font-size: 0.95rem;
          padding: 0.45rem 1.1rem;
        }

        /* ── Active ────────────────────────────────── */
        .rsb--active {
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          color: #065f46;
          border-color: #6ee7b7;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.12);
        }

        .rsb--active:hover {
          box-shadow: 0 0 0 5px rgba(16, 185, 129, 0.2);
        }

        .rsb--active .rsb__icon {
          color: #10b981;
          font-size: 0.6em;
        }

        /* ── Inactive ──────────────────────────────── */
        .rsb--inactive {
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          color: #991b1b;
          border-color: #fca5a5;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.10);
        }

        .rsb--inactive:hover {
          box-shadow: 0 0 0 5px rgba(239, 68, 68, 0.18);
        }

        .rsb--inactive .rsb__icon {
          color: #ef4444;
          font-size: 0.6em;
        }

        /* ── Pulse animation (active only) ─────────── */
        .rsb__pulse {
          position: absolute;
          left: 0.55rem;
          top: 50%;
          transform: translateY(-50%);
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10b981;
          opacity: 0;
          animation: rsb-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          pointer-events: none;
        }

        @keyframes rsb-ping {
          0%   { transform: translateY(-50%) scale(1);   opacity: 0.75; }
          75%  { transform: translateY(-50%) scale(2.2); opacity: 0;    }
          100% { transform: translateY(-50%) scale(2.2); opacity: 0;    }
        }

        .rsb__label {
          position: relative;
        }
      `}</style>
    </span>
  );
}
