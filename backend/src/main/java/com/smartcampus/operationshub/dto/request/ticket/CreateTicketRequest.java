package com.smartcampus.operationshub.dto.request.ticket;

import com.smartcampus.operationshub.enums.ticket.TicketCategory;
import com.smartcampus.operationshub.enums.ticket.TicketPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateTicketRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 150, message = "Title must not exceed 150 characters")
    private String title;

    @NotNull(message = "Category is required")
    private TicketCategory category;

    @NotBlank(message = "Description is required")
    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    @NotNull(message = "Priority is required")
    private TicketPriority priority;

    @NotBlank(message = "Preferred contact is required")
    @Size(max = 150, message = "Preferred contact must not exceed 150 characters")
    private String preferredContact;

    @Size(max = 180, message = "Location must not exceed 180 characters")
    private String locationText;

    private Long resourceId;
}
