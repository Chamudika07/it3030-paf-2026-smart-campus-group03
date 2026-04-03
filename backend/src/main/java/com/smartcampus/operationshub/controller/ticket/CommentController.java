package com.smartcampus.operationshub.controller.ticket;

import com.smartcampus.operationshub.dto.request.ticket.UpdateCommentRequest;
import com.smartcampus.operationshub.dto.response.ApiResponse;
import com.smartcampus.operationshub.dto.response.ticket.CommentResponse;
import com.smartcampus.operationshub.service.ticket.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final TicketService ticketService;

    @PutMapping("/{commentId}")
    public ResponseEntity<ApiResponse<CommentResponse>> updateComment(@PathVariable Long commentId,
                                                                      @Valid @RequestBody UpdateCommentRequest request) {
        return ResponseEntity.ok(new ApiResponse<>("Comment updated successfully",
                ticketService.updateComment(commentId, request)));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        ticketService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }
}
