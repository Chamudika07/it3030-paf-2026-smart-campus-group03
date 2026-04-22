import { http } from "./http";
import type { Booking, CreateBookingRequest } from "../types/booking";

export async function fetchBookings(): Promise<Booking[]> {
  const { data } = await http.get<{ data: Booking[] }>("/bookings");
  return data.data;
}

export async function createBooking(
  request: CreateBookingRequest,
): Promise<Booking> {
  const { data } = await http.post<{ data: Booking }>("/bookings", request);
  return data.data;
}

export async function updateBookingStatus(
  id: number,
  status: "APPROVED" | "REJECTED" | "CANCELLED",
  reason?: string,
): Promise<Booking> {
  const { data } = await http.patch<{ data: Booking }>(
    `/bookings/${id}/status`,
    {
      status,
      reason,
    },
  );
  return data.data;
}
