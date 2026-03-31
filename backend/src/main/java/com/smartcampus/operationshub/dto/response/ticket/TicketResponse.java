package com.smartcampus.operationshub.dto.response.ticket;

import com.smartcampus.operationshub.enums.ticket.TicketCategory;
import com.smartcampus.operationshub.enums.ticket.TicketPriority;
import com.smartcampus.operationshub.enums.ticket.TicketStatus;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TicketResponse {
    private Long id;
    private String title;
    private TicketCategory category;
    private String description;
    private TicketPriority priority;
    private String preferredContact;
    private String locationText;
    private Long resourceId;
    private String resourceName;
    private TicketStatus status;
    private String rejectionReason;
    private String resolutionNotes;
    private ActorSummaryResponse createdBy;
    private ActorSummaryResponse assignedTechnician;
    private List<TicketAttachmentResponse> attachments;
    private List<CommentResponse> comments;
    private boolean assignAllowed;
    private boolean statusUpdateAllowed;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
