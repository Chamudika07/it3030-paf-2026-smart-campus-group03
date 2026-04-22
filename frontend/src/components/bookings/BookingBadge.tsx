import type { BookingStatus } from "../../types/booking";

export const statusTone: Record<BookingStatus, string> = {
  PENDING: "status-open",
  APPROVED: "status-resolved",
  REJECTED: "status-rejected",
  CANCELLED: "status-closed",
};

export function formatBookingText(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

type BookingBadgeProps = {
  status: BookingStatus;
};

export function BookingBadge({ status }: BookingBadgeProps) {
  const className = statusTone[status];
  return (
    <span className={`ticket-badge ${className}`}>
      {formatBookingText(status)}
    </span>
  );
}
