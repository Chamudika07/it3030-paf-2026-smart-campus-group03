import type { TicketPriority, TicketStatus } from "../../types/ticket";

export const priorityTone: Record<TicketPriority, string> = {
  LOW: "priority-low",
  MEDIUM: "priority-medium",
  HIGH: "priority-high",
  CRITICAL: "priority-critical"
};

export const statusTone: Record<TicketStatus, string> = {
  OPEN: "status-open",
  IN_PROGRESS: "status-progress",
  RESOLVED: "status-resolved",
  CLOSED: "status-closed",
  REJECTED: "status-rejected"
};

export function formatTicketText(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
