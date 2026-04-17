export type BookingStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface Booking {
  id: number;
  resourceId: number;
  resourceName: string;
  userId: string;
  userName: string;
  startDate: string;
  endDate: string;
  purpose: string;
  expectedAttendees: number;
  status: BookingStatus;
  rejectionReason?: string;
  createdAt: string;
}

export interface CreateBookingRequest {
  resourceId: number;
  startDate: string;
  endDate: string;
  purpose: string;
  expectedAttendees: number;
}
