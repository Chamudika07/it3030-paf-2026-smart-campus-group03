import { StatCard } from "../components/common/StatCard";
import { Badge } from "../components/ui/Badge";
import { Button, buttonStyles } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { Link } from "react-router-dom";

export function DashboardPage() {
  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Operations overview"
        title="Smart campus workflows in one place"
        description="Monitor resources, maintenance operations, technician assignments, and pending campus actions from one clean workspace."
        actions={
          <>
            <Badge tone="orange">12 new updates</Badge>
            <Link to="/tickets/new" className={buttonStyles("primary")}>
              Create Ticket
            </Link>
          </>
        }
      />

      <Card className="relative overflow-hidden bg-gradient-to-br from-white via-white to-[#DBEAFE]/50">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-center">
          <div className="space-y-4">
            <Badge tone="blue">Modern SaaS dashboard</Badge>
            <div className="space-y-3">
              <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-[#0F172A]">
                Designed with a 60-30-10 balance: white layout, blue actions, orange highlights.
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-[#334155]">
                The interface now emphasizes clarity, hierarchy, and accessibility with reusable
                cards, buttons, tables, form controls, and status badges.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/resources" className={buttonStyles("primary")}>
                View Resources
              </Link>
              <Button variant="secondary">Review Alerts</Button>
            </div>
          </div>

          <div className="grid gap-3 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-md shadow-slate-200/50">
            <div className="flex items-center justify-between rounded-2xl bg-[#F8FAFC] px-4 py-3">
              <span className="text-sm text-[#334155]">Workflow health</span>
              <Badge tone="orange">Priority</Badge>
            </div>
            <div className="grid gap-3 text-sm text-[#334155]">
              <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] px-4 py-3">
                <span>Open tickets</span>
                <strong className="text-[#0F172A]">07</strong>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] px-4 py-3">
                <span>Pending bookings</span>
                <strong className="text-[#0F172A]">04</strong>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] px-4 py-3">
                <span>Unread alerts</span>
                <strong className="text-[#EA580C]">03</strong>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-3">
        <StatCard label="Resources" value="12" helper="Sample seeded later" />
        <StatCard label="Pending Bookings" value="04" helper="Approval queue" />
        <StatCard label="Open Tickets" value="07" helper="Needs technician review" />
      </div>
    </section>
  );
}
