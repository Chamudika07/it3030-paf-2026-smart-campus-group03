package com.smartcampus.operationshub.service.booking.impl;

import com.smartcampus.operationshub.dto.request.BookingAvailabilityRequest;
import com.smartcampus.operationshub.dto.request.CreateBookingRequest;
import com.smartcampus.operationshub.dto.request.UpdateBookingStatusRequest;
import com.smartcampus.operationshub.dto.response.BookingAvailabilityResponse;
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

import java.time.LocalDateTime;
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

        Long resourceId = request.getResourceId();
        if (resourceId == null) {
            throw new BadRequestException("Resource ID is required");
        }

        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

        validateDateRange(request.getStartDate(), request.getEndDate());

        if (request.getExpectedAttendees() > resource.getCapacity()) {
            throw new BadRequestException("Expected attendees cannot exceed resource capacity of " + resource.getCapacity());
        }

        if (hasConflictingBooking(resourceId, request.getStartDate(), request.getEndDate())) {
            throw new BadRequestException("Selected time range overlaps with an existing booking for this resource");
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

        @SuppressWarnings("null")
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
        @Transactional(readOnly = true)
        public BookingAvailabilityResponse checkBookingAvailability(BookingAvailabilityRequest request) {
        Long resourceId = request.getResourceId();
        if (resourceId == null) {
            throw new BadRequestException("Resource ID is required");
        }

        resourceRepository.findById(resourceId)
            .orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

        validateDateRange(request.getStartDate(), request.getEndDate());

        boolean available = !hasConflictingBooking(resourceId, request.getStartDate(), request.getEndDate());
        String message = available
            ? "Resource is available for the selected time range"
            : "Selected time range overlaps with an existing booking for this resource";

        return BookingAvailabilityResponse.builder()
            .available(available)
            .message(message)
            .build();
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

        // Update the resource's active status based on booking status
        Resource resource = booking.getResource();
        if (request.getStatus() == BookingStatus.APPROVED) {
            resource.setActive(false);
            resourceRepository.save(resource);
        } else if (request.getStatus() == BookingStatus.CANCELLED || request.getStatus() == BookingStatus.REJECTED) {
            resource.setActive(true);
            resourceRepository.save(resource);
        }

        Booking updatedBooking = bookingRepository.save(booking);
        return mapToResponse(updatedBooking);
    }

    private void validateDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        if (startDate == null || endDate == null) {
            throw new BadRequestException("Start date and end date are required");
        }

        if (!startDate.isBefore(endDate)) {
            throw new BadRequestException("End date must be after start date");
        }
    }

    private boolean hasConflictingBooking(Long resourceId, LocalDateTime startDate, LocalDateTime endDate) {
        return bookingRepository.existsByResourceIdAndStatusInAndStartDateLessThanAndEndDateGreaterThan(
                resourceId,
                List.of(BookingStatus.PENDING, BookingStatus.APPROVED),
                endDate,
                startDate
        );
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
