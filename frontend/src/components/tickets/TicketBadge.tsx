import { formatTicketText, priorityTone, statusTone } from "./ticketAppearance";
import type { TicketPriority, TicketStatus } from "../../types/ticket";

type TicketBadgeProps = {
  value: TicketPriority | TicketStatus;
  kind: "priority" | "status";
};

export function TicketBadge({ value, kind }: TicketBadgeProps) {
  const className =
    kind === "priority" ? priorityTone[value as TicketPriority] : statusTone[value as TicketStatus];

  return <span className={`ticket-badge ${className}`}>{formatTicketText(value)}</span>;
}
