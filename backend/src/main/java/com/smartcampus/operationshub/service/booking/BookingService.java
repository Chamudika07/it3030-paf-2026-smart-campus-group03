package com.smartcampus.operationshub.service.booking;

import com.smartcampus.operationshub.dto.request.BookingAvailabilityRequest;
import com.smartcampus.operationshub.dto.request.CreateBookingRequest;
import com.smartcampus.operationshub.dto.request.UpdateBookingStatusRequest;
import com.smartcampus.operationshub.dto.response.BookingAvailabilityResponse;
import com.smartcampus.operationshub.dto.response.BookingResponse;

import java.util.List;

public interface BookingService {
    BookingResponse createBooking(CreateBookingRequest request);
    List<BookingResponse> getAllBookings();
    BookingResponse getBookingById(Long id);
    BookingAvailabilityResponse checkBookingAvailability(BookingAvailabilityRequest request);
    BookingResponse updateBookingStatus(Long id, UpdateBookingStatusRequest request);
}
