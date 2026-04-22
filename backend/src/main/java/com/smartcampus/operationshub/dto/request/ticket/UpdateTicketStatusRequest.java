package com.smartcampus.operationshub.dto.request.ticket;

import com.smartcampus.operationshub.enums.ticket.TicketStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateTicketStatusRequest {

    @NotNull(message = "Status is required")
    private TicketStatus status;

    @Size(max = 1500, message = "Resolution notes must not exceed 1500 characters")
    private String resolutionNotes;

    @Size(max = 500, message = "Rejection reason must not exceed 500 characters")
    private String rejectionReason;
}
