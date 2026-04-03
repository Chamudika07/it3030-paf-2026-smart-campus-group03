package com.smartcampus.operationshub.dto.response.ticket;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TicketAttachmentResponse {
    private Long id;
    private String originalFileName;
    private String fileType;
    private Long fileSize;
    private String previewUrl;
    private LocalDateTime uploadedAt;
}
