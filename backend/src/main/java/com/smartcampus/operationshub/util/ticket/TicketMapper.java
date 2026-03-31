package com.smartcampus.operationshub.util.ticket;

import com.smartcampus.operationshub.dto.response.ticket.ActorSummaryResponse;
import com.smartcampus.operationshub.dto.response.ticket.CommentResponse;
import com.smartcampus.operationshub.dto.response.ticket.TicketAttachmentResponse;
import com.smartcampus.operationshub.dto.response.ticket.TicketResponse;
import com.smartcampus.operationshub.dto.response.ticket.TicketSummaryResponse;
import com.smartcampus.operationshub.entity.ticket.Comment;
import com.smartcampus.operationshub.entity.ticket.Ticket;
import com.smartcampus.operationshub.entity.ticket.TicketAttachment;
import com.smartcampus.operationshub.security.ticket.CurrentUser;
import java.util.List;

public final class TicketMapper {

    private TicketMapper() {
    }

    public static TicketSummaryResponse toSummaryResponse(Ticket ticket) {
        return TicketSummaryResponse.builder()
                .id(ticket.getId())
                .title(ticket.getTitle())
                .category(ticket.getCategory())
                .priority(ticket.getPriority())
                .status(ticket.getStatus())
                .locationText(ticket.getLocationText())
                .createdBy(toActor(ticket.getCreatedByIdentifier(), ticket.getCreatedByName(), null, ticket.getCreatedByRole()))
                .assignedTechnician(toAssignedTechnician(ticket))
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .build();
    }

    public static TicketResponse toResponse(Ticket ticket, CurrentUser currentUser) {
        return TicketResponse.builder()
                .id(ticket.getId())
                .title(ticket.getTitle())
                .category(ticket.getCategory())
                .description(ticket.getDescription())
                .priority(ticket.getPriority())
                .preferredContact(ticket.getPreferredContact())
                .locationText(ticket.getLocationText())
                .resourceId(ticket.getResource() == null ? null : ticket.getResource().getId())
                .resourceName(ticket.getResource() == null ? null : ticket.getResource().getName())
                .status(ticket.getStatus())
                .rejectionReason(ticket.getRejectionReason())
                .resolutionNotes(ticket.getResolutionNotes())
                .createdBy(toActor(ticket.getCreatedByIdentifier(), ticket.getCreatedByName(), null, ticket.getCreatedByRole()))
                .assignedTechnician(toAssignedTechnician(ticket))
                .attachments(ticket.getAttachments().stream().map(TicketMapper::toAttachmentResponse).toList())
                .comments(ticket.getComments().stream().map(comment -> toCommentResponse(comment, currentUser)).toList())
                .assignAllowed(currentUser.getRole().name().equals("ADMIN"))
                .statusUpdateAllowed(canUpdateStatus(ticket, currentUser))
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .build();
    }

    public static TicketAttachmentResponse toAttachmentResponse(TicketAttachment attachment) {
        return TicketAttachmentResponse.builder()
                .id(attachment.getId())
                .originalFileName(attachment.getOriginalFileName())
                .fileType(attachment.getFileType())
                .fileSize(attachment.getFileSize())
                .previewUrl("/api/tickets/attachments/" + attachment.getId())
                .uploadedAt(attachment.getCreatedAt())
                .build();
    }

    public static CommentResponse toCommentResponse(Comment comment, CurrentUser currentUser) {
        boolean owner = comment.getAuthorIdentifier().equalsIgnoreCase(currentUser.getIdentifier());
        boolean admin = currentUser.getRole().name().equals("ADMIN");

        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .author(toActor(comment.getAuthorIdentifier(), comment.getAuthorName(), null, comment.getAuthorRole()))
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .editableByCurrentUser(owner)
                .deletableByCurrentUser(owner || admin)
                .build();
    }

    private static ActorSummaryResponse toAssignedTechnician(Ticket ticket) {
        if (ticket.getAssignedTechnicianIdentifier() == null || ticket.getAssignedTechnicianName() == null) {
            return null;
        }

        return toActor(
                ticket.getAssignedTechnicianIdentifier(),
                ticket.getAssignedTechnicianName(),
                ticket.getAssignedTechnicianEmail(),
                com.smartcampus.operationshub.enums.AppUserRole.TECHNICIAN
        );
    }

    private static ActorSummaryResponse toActor(String identifier, String name, String email,
                                                com.smartcampus.operationshub.enums.AppUserRole role) {
        return ActorSummaryResponse.builder()
                .identifier(identifier)
                .name(name)
                .email(email)
                .role(role)
                .build();
    }

    private static boolean canUpdateStatus(Ticket ticket, CurrentUser currentUser) {
        if (currentUser.getRole().name().equals("ADMIN")) {
            return true;
        }

        return currentUser.getRole().name().equals("TECHNICIAN")
                && ticket.getAssignedTechnicianIdentifier() != null
                && ticket.getAssignedTechnicianIdentifier().equalsIgnoreCase(currentUser.getIdentifier());
    }
}
