export type NotificationType =
  | "BOOKING_APPROVED"
  | "BOOKING_REJECTED"
  | "TICKET_STATUS_CHANGED"
  | "NEW_COMMENT";

export type AppNotification = {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  referenceId?: string | null;
  read: boolean;
  createdAt: string;
};
