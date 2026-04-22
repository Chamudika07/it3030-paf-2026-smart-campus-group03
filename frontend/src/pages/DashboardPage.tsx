import { StatCard } from "../components/common/StatCard";

export function DashboardPage() {
  return (
    <section className="stack">
      <div className="hero-card">
        <p className="eyebrow">Operations overview</p>
        <h2>Smart campus workflows in one place</h2>
        <p>
          Start with resources, add booking conflict logic next, then connect tickets,
          notifications, and OAuth login.
        </p>
      </div>

      <div className="card-grid">
        <StatCard label="Resources" value="12" helper="Sample seeded later" />
        <StatCard label="Pending Bookings" value="04" helper="Approval queue" />
        <StatCard label="Open Tickets" value="07" helper="Needs technician review" />
      </div>
    </section>
  );
}

