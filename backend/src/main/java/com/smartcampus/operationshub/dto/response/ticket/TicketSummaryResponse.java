package com.smartcampus.operationshub.dto.response.ticket;

import com.smartcampus.operationshub.enums.ticket.TicketCategory;
import com.smartcampus.operationshub.enums.ticket.TicketPriority;
import com.smartcampus.operationshub.enums.ticket.TicketStatus;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TicketSummaryResponse {
    private Long id;
    private String title;
    private TicketCategory category;
    private TicketPriority priority;
    private TicketStatus status;
    private String locationText;
    private ActorSummaryResponse createdBy;
    private ActorSummaryResponse assignedTechnician;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
