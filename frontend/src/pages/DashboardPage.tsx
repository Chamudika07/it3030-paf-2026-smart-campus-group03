import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchResources } from "../api/resourceApi";
import { StatCard } from "../components/common/StatCard";

export function DashboardPage() {
  const [resourceCount, setResourceCount] = useState<number | null>(null);

  useEffect(() => {
    fetchResources().then((data) => setResourceCount(data.length)).catch(() => setResourceCount(0));
  }, []);
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
        <Link to="/resources" style={{ textDecoration: 'none', color: 'inherit' }}>
          <StatCard 
            label="Resources" 
            value={resourceCount === null ? "..." : resourceCount.toString()} 
            helper="Total resources tracked" 
          />
        </Link>
        <StatCard label="Pending Bookings" value="04" helper="Approval queue" />
        <StatCard label="Open Tickets" value="07" helper="Needs technician review" />
      </div>
    </section>
  );
}

