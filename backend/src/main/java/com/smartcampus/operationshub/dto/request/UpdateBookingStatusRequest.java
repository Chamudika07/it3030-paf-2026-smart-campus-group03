package com.smartcampus.operationshub.dto.request;

import com.smartcampus.operationshub.enums.BookingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateBookingStatusRequest {

    @NotNull(message = "Status is required")
    private BookingStatus status;

    private String reason;
}
