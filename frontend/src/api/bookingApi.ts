import { http } from "./http";
import type { Booking, CreateBookingRequest } from "../types/booking";

type ApiResponse<T> = {
  message: string;
  data: T;
};

type BookingAvailability = {
  available: boolean;
  message?: string;
};

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

export async function fetchBookingById(id: number): Promise<Booking> {
  const { data } = await http.get<{ data: Booking }>(`/bookings/${id}`);
  return data.data;
}

export async function checkBookingAvailability(
  resourceId: number,
  startDate: string,
  endDate: string,
): Promise<{ available: boolean; message?: string }> {
  const { data } = await http.post<ApiResponse<BookingAvailability>>(
    "/bookings/availability",
    {
      resourceId,
      startDate,
      endDate,
    },
  );
  return data.data;
}
