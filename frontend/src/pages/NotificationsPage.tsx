import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";

export function NotificationsPage() {
  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Member 4 ownership"
        title="Notifications"
        description="Build user alerts for booking decisions, ticket updates, comment activity, and operational reminders."
        actions={<Badge tone="orange">3 priority alerts</Badge>}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="space-y-3">
          <Badge tone="orange" className="w-fit">
            Ticket alert
          </Badge>
          <h2 className="text-lg font-semibold text-[#0F172A]">New technician update</h2>
          <p className="text-sm leading-6 text-[#334155]">
            Highlight important workflow changes with orange badges for quicker scanning.
          </p>
        </Card>
        <Card className="space-y-3">
          <Badge tone="blue" className="w-fit">
            Booking
          </Badge>
          <h2 className="text-lg font-semibold text-[#0F172A]">Approval pending</h2>
          <p className="text-sm leading-6 text-[#334155]">
            Use blue for standard action states and orange only for high-attention moments.
          </p>
        </Card>
        <Card className="space-y-3">
          <Badge tone="neutral" className="w-fit">
            System
          </Badge>
          <h2 className="text-lg font-semibold text-[#0F172A]">Digest ready</h2>
          <p className="text-sm leading-6 text-[#334155]">
            Notification cards now fit the same rounded, shadowed, responsive design system.
          </p>
        </Card>
      </div>
    </section>
  );
}
