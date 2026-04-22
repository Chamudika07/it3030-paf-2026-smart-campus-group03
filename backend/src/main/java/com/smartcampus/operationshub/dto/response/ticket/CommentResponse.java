package com.smartcampus.operationshub.dto.response.ticket;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CommentResponse {
    private Long id;
    private String content;
    private ActorSummaryResponse author;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean editableByCurrentUser;
    private boolean deletableByCurrentUser;
}
