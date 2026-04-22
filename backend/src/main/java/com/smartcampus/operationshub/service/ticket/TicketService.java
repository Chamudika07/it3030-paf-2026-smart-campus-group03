package com.smartcampus.operationshub.service.ticket;

import com.smartcampus.operationshub.dto.request.ticket.AssignTechnicianRequest;
import com.smartcampus.operationshub.dto.request.ticket.CreateCommentRequest;
import com.smartcampus.operationshub.dto.request.ticket.CreateTicketRequest;
import com.smartcampus.operationshub.dto.request.ticket.UpdateCommentRequest;
import com.smartcampus.operationshub.dto.request.ticket.UpdateTicketStatusRequest;
import com.smartcampus.operationshub.dto.response.ticket.CommentResponse;
import com.smartcampus.operationshub.dto.response.ticket.TicketResponse;
import com.smartcampus.operationshub.dto.response.ticket.TicketSummaryResponse;
import java.util.List;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface TicketService {
    TicketResponse createTicket(CreateTicketRequest request, List<MultipartFile> attachments);
    List<TicketSummaryResponse> getAllTickets();
    TicketResponse getTicketById(Long id);
    TicketResponse assignTechnician(Long id, AssignTechnicianRequest request);
    TicketResponse updateStatus(Long id, UpdateTicketStatusRequest request);
    CommentResponse addComment(Long ticketId, CreateCommentRequest request);
    CommentResponse updateComment(Long commentId, UpdateCommentRequest request);
    void deleteComment(Long commentId);
    Resource loadAttachment(Long attachmentId);
    String getAttachmentContentType(Long attachmentId);
}
