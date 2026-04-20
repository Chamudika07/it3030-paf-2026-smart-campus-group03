import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";

export function BookingsPage() {
  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Member 2 ownership"
        title="Bookings"
        description="Build request, approval, rejection, cancellation, and overlap validation here."
        actions={<Badge tone="orange">Upcoming module</Badge>}
      />
      <Card className="space-y-4">
        <h2 className="text-lg font-semibold text-[#0F172A]">Booking workflow foundation</h2>
        <p className="max-w-2xl text-sm leading-6 text-[#334155]">
          This area is ready for a modern approval queue with striped tables, alert badges,
          and clear action hierarchy.
        </p>
      </Card>
    </section>
  );
}
