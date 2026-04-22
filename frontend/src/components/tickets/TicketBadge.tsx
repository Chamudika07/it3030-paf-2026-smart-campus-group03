import { formatTicketText, priorityTone, statusTone } from "./ticketAppearance";
import type { TicketPriority, TicketStatus } from "../../types/ticket";
import { cn } from "../../utils/cn";

type TicketBadgeProps = {
  value: TicketPriority | TicketStatus;
  kind: "priority" | "status";
};

export function TicketBadge({ value, kind }: TicketBadgeProps) {
  const className =
    kind === "priority" ? priorityTone[value as TicketPriority] : statusTone[value as TicketStatus];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
        className
      )}
    >
      {formatTicketText(value)}
    </span>
  );
}
