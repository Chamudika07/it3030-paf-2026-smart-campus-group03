package com.smartcampus.operationshub.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BookingAvailabilityResponse {
    private boolean available;
    private String message;
}