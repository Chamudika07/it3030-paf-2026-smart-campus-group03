package com.smartcampus.operationshub.service.booking.impl;

import com.smartcampus.operationshub.dto.request.CreateBookingRequest;
import com.smartcampus.operationshub.dto.request.UpdateBookingStatusRequest;
import com.smartcampus.operationshub.dto.response.BookingResponse;
import com.smartcampus.operationshub.entity.Booking;
import com.smartcampus.operationshub.entity.Resource;
import com.smartcampus.operationshub.enums.BookingStatus;
import com.smartcampus.operationshub.exception.BadRequestException;
import com.smartcampus.operationshub.exception.ResourceNotFoundException;
import com.smartcampus.operationshub.repository.BookingRepository;
import com.smartcampus.operationshub.repository.ResourceRepository;
import com.smartcampus.operationshub.security.ticket.CurrentUser;
import com.smartcampus.operationshub.security.ticket.CurrentUserProvider;
import com.smartcampus.operationshub.service.booking.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final CurrentUserProvider currentUserProvider;

    @Override
    public BookingResponse createBooking(CreateBookingRequest request) {
        CurrentUser currentUser = currentUserProvider.getCurrentUser();

        Resource resource = resourceRepository.findById(request.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

        if (request.getStartDate().isAfter(request.getEndDate()) || request.getStartDate().isEqual(request.getEndDate())) {
            throw new BadRequestException("End date must be after start date");
        }

        if (request.getExpectedAttendees() > resource.getCapacity()) {
            throw new BadRequestException("Expected attendees cannot exceed resource capacity of " + resource.getCapacity());
        }

        Booking booking = Booking.builder()
                .resource(resource)
                .userId(currentUser.getIdentifier())
                .userName(currentUser.getName())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .purpose(request.getPurpose())
                .expectedAttendees(request.getExpectedAttendees())
                .status(BookingStatus.PENDING)
                .build();

        Booking savedBooking = bookingRepository.save(booking);
        return mapToResponse(savedBooking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        return mapToResponse(booking);
    }

    @Override
    public BookingResponse updateBookingStatus(Long id, UpdateBookingStatusRequest request) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (request.getStatus() == BookingStatus.REJECTED && (request.getReason() == null || request.getReason().trim().isEmpty())) {
            throw new BadRequestException("Rejection reason is required when rejecting a booking");
        }

        booking.setStatus(request.getStatus());
        
        if (request.getStatus() == BookingStatus.REJECTED) {
            booking.setRejectionReason(request.getReason());
        } else {
            booking.setRejectionReason(null);
        }

        Booking updatedBooking = bookingRepository.save(booking);
        return mapToResponse(updatedBooking);
    }

    private BookingResponse mapToResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .resourceId(booking.getResource().getId())
                .resourceName(booking.getResource().getName())
                .userId(booking.getUserId())
                .userName(booking.getUserName())
                .startDate(booking.getStartDate())
                .endDate(booking.getEndDate())
                .purpose(booking.getPurpose())
                .expectedAttendees(booking.getExpectedAttendees())
                .status(booking.getStatus())
                .rejectionReason(booking.getRejectionReason())
                .createdAt(booking.getCreatedAt())
                .build();
    }
}
