package com.smartcampus.operationshub.dto.response;

import com.smartcampus.operationshub.enums.BookingStatus;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BookingResponse {
    private Long id;
    private Long resourceId;
    private String resourceName;
    private String userId;
    private String userName;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String purpose;
    private Integer expectedAttendees;
    private BookingStatus status;
    private String rejectionReason;
    private LocalDateTime createdAt;
}
