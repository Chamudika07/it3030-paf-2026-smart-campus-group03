import type { TicketPriority, TicketStatus } from "../../types/ticket";

export const priorityTone: Record<TicketPriority, string> = {
  LOW: "bg-emerald-100 text-emerald-700",
  MEDIUM: "bg-[#DBEAFE] text-[#1D4ED8]",
  HIGH: "bg-[#FFEDD5] text-[#EA580C]",
  CRITICAL: "bg-rose-100 text-rose-700"
};

export const statusTone: Record<TicketStatus, string> = {
  OPEN: "bg-[#DBEAFE] text-[#1D4ED8]",
  IN_PROGRESS: "bg-indigo-100 text-indigo-700",
  RESOLVED: "bg-emerald-100 text-emerald-700",
  CLOSED: "bg-slate-100 text-[#334155]",
  REJECTED: "bg-rose-100 text-rose-700"
};

export function formatTicketText(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
