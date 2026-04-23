import type { BookingStatus } from "../../types/booking";

export const statusTone: Record<BookingStatus, string> = {
  PENDING: "bg-orange-100 text-orange-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  CANCELLED: "bg-red-100 text-red-800",
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
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${className}`}
    >
      {formatBookingText(status)}
    </span>
  );
}
