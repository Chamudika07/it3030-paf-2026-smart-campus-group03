package com.smartcampus.operationshub.controller.ticket;

import com.smartcampus.operationshub.dto.request.ticket.AssignTechnicianRequest;
import com.smartcampus.operationshub.dto.request.ticket.CreateCommentRequest;
import com.smartcampus.operationshub.dto.request.ticket.CreateTicketRequest;
import com.smartcampus.operationshub.dto.request.ticket.UpdateTicketStatusRequest;
import com.smartcampus.operationshub.dto.response.ApiResponse;
import com.smartcampus.operationshub.dto.response.ticket.CommentResponse;
import com.smartcampus.operationshub.dto.response.ticket.TicketResponse;
import com.smartcampus.operationshub.dto.response.ticket.TicketSummaryResponse;
import com.smartcampus.operationshub.service.ticket.TicketService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@Validated
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<TicketResponse>> createTicket(
            @Valid @RequestPart("ticket") CreateTicketRequest request,
            @RequestPart(value = "attachments", required = false) List<MultipartFile> attachments) {
        TicketResponse response = ticketService.createTicket(request, attachments);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>("Ticket created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TicketSummaryResponse>>> getAllTickets() {
        return ResponseEntity.ok(new ApiResponse<>("Tickets fetched successfully", ticketService.getAllTickets()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TicketResponse>> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>("Ticket fetched successfully", ticketService.getTicketById(id)));
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<ApiResponse<TicketResponse>> assignTechnician(@PathVariable Long id,
                                                                        @Valid @RequestBody AssignTechnicianRequest request) {
        return ResponseEntity.ok(new ApiResponse<>("Technician assigned successfully",
                ticketService.assignTechnician(id, request)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<TicketResponse>> updateStatus(@PathVariable Long id,
                                                                    @Valid @RequestBody UpdateTicketStatusRequest request) {
        return ResponseEntity.ok(new ApiResponse<>("Ticket status updated successfully",
                ticketService.updateStatus(id, request)));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<ApiResponse<CommentResponse>> addComment(@PathVariable Long id,
                                                                   @Valid @RequestBody CreateCommentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>("Comment created successfully", ticketService.addComment(id, request)));
    }

    @GetMapping("/attachments/{attachmentId}")
    public ResponseEntity<org.springframework.core.io.Resource> getAttachment(@PathVariable Long attachmentId) {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, ticketService.getAttachmentContentType(attachmentId))
                .body(ticketService.loadAttachment(attachmentId));
    }
}
