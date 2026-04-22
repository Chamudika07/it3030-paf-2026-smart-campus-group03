import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";

type StatCardProps = {
  label: string;
  value: string;
  helper: string;
};

export function StatCard({ label, value, helper }: StatCardProps) {
  return (
    <Card
      as="article"
      className="relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-md shadow-slate-200/60 transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/70"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-[#2563EB]" />
      <div className="space-y-4">
        <Badge tone="orange" className="w-fit">
          Live metric
        </Badge>
        <div className="space-y-1">
          <p className="text-sm font-medium text-[#334155]">{label}</p>
          <h3 className="text-4xl font-semibold tracking-tight text-[#0F172A]">{value}</h3>
        </div>
        <span className="text-sm text-[#94A3B8]">{helper}</span>
      </div>
    </Card>
  );
}
