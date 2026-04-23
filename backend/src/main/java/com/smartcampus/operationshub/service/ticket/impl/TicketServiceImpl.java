package com.smartcampus.operationshub.service.ticket.impl;

import com.smartcampus.operationshub.dto.request.ticket.AssignTechnicianRequest;
import com.smartcampus.operationshub.dto.request.ticket.CreateCommentRequest;
import com.smartcampus.operationshub.dto.request.ticket.CreateTicketRequest;
import com.smartcampus.operationshub.dto.request.ticket.UpdateCommentRequest;
import com.smartcampus.operationshub.dto.request.ticket.UpdateTicketStatusRequest;
import com.smartcampus.operationshub.dto.response.ticket.CommentResponse;
import com.smartcampus.operationshub.dto.response.ticket.TicketResponse;
import com.smartcampus.operationshub.dto.response.ticket.TicketSummaryResponse;
import com.smartcampus.operationshub.entity.ticket.Comment;
import com.smartcampus.operationshub.entity.ticket.Ticket;
import com.smartcampus.operationshub.entity.ticket.TicketAttachment;
import com.smartcampus.operationshub.enums.AppUserRole;
import com.smartcampus.operationshub.enums.ticket.TicketStatus;
import com.smartcampus.operationshub.exception.BadRequestException;
import com.smartcampus.operationshub.exception.ForbiddenOperationException;
import com.smartcampus.operationshub.exception.InvalidTicketStateException;
import com.smartcampus.operationshub.exception.ResourceNotFoundException;
import com.smartcampus.operationshub.repository.ResourceRepository;
import com.smartcampus.operationshub.repository.ticket.CommentRepository;
import com.smartcampus.operationshub.repository.ticket.TicketAttachmentRepository;
import com.smartcampus.operationshub.repository.ticket.TicketRepository;
import com.smartcampus.operationshub.security.ticket.CurrentUser;
import com.smartcampus.operationshub.security.ticket.CurrentUserProvider;
import com.smartcampus.operationshub.service.ticket.TicketAttachmentStorageService;
import com.smartcampus.operationshub.service.ticket.TicketService;
import com.smartcampus.operationshub.util.ticket.TicketMapper;
import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Transactional
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final CommentRepository commentRepository;
    private final TicketAttachmentRepository ticketAttachmentRepository;
    private final ResourceRepository resourceRepository;
    private final TicketAttachmentStorageService ticketAttachmentStorageService;
    private final CurrentUserProvider currentUserProvider;

    @Override
    public TicketResponse createTicket(CreateTicketRequest request, List<MultipartFile> attachments) {
        CurrentUser currentUser = currentUserProvider.getCurrentUser();
        if (request.getResourceId() == null && isBlank(request.getLocationText())) {
            throw new BadRequestException("Either a resource reference or a location must be provided");
        }

        Ticket ticket = new Ticket();
        ticket.setTitle(request.getTitle().trim());
        ticket.setCategory(request.getCategory());
        ticket.setDescription(request.getDescription().trim());
        ticket.setPriority(request.getPriority());
        ticket.setPreferredContact(request.getPreferredContact().trim());
        ticket.setLocationText(trimToNull(request.getLocationText()));
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setCreatedByIdentifier(currentUser.getIdentifier());
        ticket.setCreatedByName(currentUser.getName());
        ticket.setCreatedByRole(currentUser.getRole());
        ticket.setResource(resolveResource(request.getResourceId()));

        Ticket savedTicket = ticketRepository.save(ticket);
        List<TicketAttachment> storedAttachments =
                ticketAttachmentStorageService.storeAttachments(savedTicket, attachments);
        savedTicket.getAttachments().addAll(storedAttachments);

        return TicketMapper.toResponse(ticketRepository.save(savedTicket), currentUser);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TicketSummaryResponse> getAllTickets() {
        return ticketRepository.findAll().stream()
                .sorted((left, right) -> right.getCreatedAt().compareTo(left.getCreatedAt()))
                .map(TicketMapper::toSummaryResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TicketResponse getTicketById(Long id) {
        Ticket ticket = getTicketEntity(id);
        return TicketMapper.toResponse(ticket, currentUserProvider.getCurrentUser());
    }

    @Override
    public TicketResponse assignTechnician(Long id, AssignTechnicianRequest request) {
        CurrentUser currentUser = currentUserProvider.getCurrentUser();
        requireAdmin(currentUser);

        Ticket ticket = getTicketEntity(id);
        if (ticket.getStatus() == TicketStatus.CLOSED || ticket.getStatus() == TicketStatus.REJECTED) {
            throw new InvalidTicketStateException("Technicians cannot be assigned to closed or rejected tickets");
        }

        ticket.setAssignedTechnicianIdentifier(request.getTechnicianIdentifier().trim());
        ticket.setAssignedTechnicianName(request.getTechnicianName().trim());
        ticket.setAssignedTechnicianEmail(trimToNull(request.getTechnicianEmail()));

        if (ticket.getStatus() == TicketStatus.OPEN) {
            ticket.setStatus(TicketStatus.IN_PROGRESS);
        }

        return TicketMapper.toResponse(ticketRepository.save(ticket), currentUser);
    }

    @Override
    public TicketResponse updateStatus(Long id, UpdateTicketStatusRequest request) {
        CurrentUser currentUser = currentUserProvider.getCurrentUser();
        Ticket ticket = getTicketEntity(id);

        if (!canUpdateStatus(ticket, currentUser)) {
            throw new ForbiddenOperationException("Only an admin or the assigned technician can update this ticket");
        }

        validateStatusTransition(ticket.getStatus(), request.getStatus());

        if (request.getStatus() == TicketStatus.RESOLVED && isBlank(request.getResolutionNotes())) {
            throw new BadRequestException("Resolution notes are required when a ticket is resolved");
        }

        if (request.getStatus() == TicketStatus.REJECTED && isBlank(request.getRejectionReason())) {
            throw new BadRequestException("Rejection reason is required when a ticket is rejected");
        }

        ticket.setStatus(request.getStatus());
        ticket.setResolutionNotes(trimToNull(request.getResolutionNotes()));
        ticket.setRejectionReason(trimToNull(request.getRejectionReason()));

        if (request.getStatus() != TicketStatus.REJECTED) {
            ticket.setRejectionReason(null);
        }

        if (request.getStatus() != TicketStatus.RESOLVED) {
            ticket.setResolutionNotes(trimToNull(request.getResolutionNotes()));
        }

        return TicketMapper.toResponse(ticketRepository.save(ticket), currentUser);
    }

    @Override
    public CommentResponse addComment(Long ticketId, CreateCommentRequest request) {
        CurrentUser currentUser = currentUserProvider.getCurrentUser();
        Ticket ticket = getTicketEntity(ticketId);

        Comment comment = new Comment();
        comment.setTicket(ticket);
        comment.setAuthorIdentifier(currentUser.getIdentifier());
        comment.setAuthorName(currentUser.getName());
        comment.setAuthorRole(currentUser.getRole());
        comment.setContent(request.getContent().trim());

        Comment savedComment = commentRepository.save(comment);
        ticket.getComments().add(savedComment);
        return TicketMapper.toCommentResponse(savedComment, currentUser);
    }

    @Override
    public CommentResponse updateComment(Long commentId, UpdateCommentRequest request) {
        CurrentUser currentUser = currentUserProvider.getCurrentUser();
        Comment comment = getCommentEntity(commentId);

        if (!comment.getAuthorIdentifier().equalsIgnoreCase(currentUser.getIdentifier())) {
            throw new ForbiddenOperationException("Only the comment owner can edit this comment");
        }

        comment.setContent(request.getContent().trim());
        return TicketMapper.toCommentResponse(commentRepository.save(comment), currentUser);
    }

    @Override
    public void deleteComment(Long commentId) {
        CurrentUser currentUser = currentUserProvider.getCurrentUser();
        Comment comment = getCommentEntity(commentId);
        boolean owner = comment.getAuthorIdentifier().equalsIgnoreCase(currentUser.getIdentifier());
        boolean admin = currentUser.getRole() == AppUserRole.ADMIN;

        if (!owner && !admin) {
            throw new ForbiddenOperationException("Only the comment owner or an admin can delete this comment");
        }

        commentRepository.delete(comment);
    }

    @Override
    @Transactional(readOnly = true)
    public org.springframework.core.io.Resource loadAttachment(Long attachmentId) {
        return ticketAttachmentStorageService.loadAsResource(getAttachmentEntity(attachmentId));
    }

    @Override
    @Transactional(readOnly = true)
    public String getAttachmentContentType(Long attachmentId) {
        return getAttachmentEntity(attachmentId).getFileType();
    }

    private Ticket getTicketEntity(Long id) {
        Long safeId = Objects.requireNonNull(id, "Ticket id must not be null");
        return ticketRepository.findById(safeId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
    }

    private Comment getCommentEntity(Long id) {
        Long safeId = Objects.requireNonNull(id, "Comment id must not be null");
        return commentRepository.findById(safeId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + id));
    }

    private TicketAttachment getAttachmentEntity(Long id) {
        Long safeId = Objects.requireNonNull(id, "Attachment id must not be null");
        return ticketAttachmentRepository.findById(safeId)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment not found with id: " + id));
    }

    private com.smartcampus.operationshub.entity.Resource resolveResource(Long resourceId) {
        if (resourceId == null) {
            return null;
        }

        return resourceRepository.findById(resourceId)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + resourceId));
    }

    private void requireAdmin(CurrentUser currentUser) {
        if (currentUser.getRole() != AppUserRole.ADMIN) {
            throw new ForbiddenOperationException("Only admins can assign technicians");
        }
    }

    private boolean canUpdateStatus(Ticket ticket, CurrentUser currentUser) {
        if (currentUser.getRole() == AppUserRole.ADMIN) {
            return true;
        }

        return currentUser.getRole() == AppUserRole.TECHNICIAN
                && ticket.getAssignedTechnicianIdentifier() != null
                && ticket.getAssignedTechnicianIdentifier().equalsIgnoreCase(currentUser.getIdentifier());
    }

    private void validateStatusTransition(TicketStatus currentStatus, TicketStatus nextStatus) {
        if (currentStatus == nextStatus) {
            return;
        }

        boolean valid = switch (currentStatus) {
            case OPEN -> nextStatus == TicketStatus.IN_PROGRESS || nextStatus == TicketStatus.REJECTED;
            case IN_PROGRESS -> nextStatus == TicketStatus.RESOLVED || nextStatus == TicketStatus.REJECTED;
            case RESOLVED -> nextStatus == TicketStatus.CLOSED || nextStatus == TicketStatus.IN_PROGRESS;
            case CLOSED, REJECTED -> false;
        };

        if (!valid) {
            throw new InvalidTicketStateException(
                    "Cannot change ticket status from " + currentStatus + " to " + nextStatus
            );
        }
    }

    private String trimToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
