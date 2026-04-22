package com.smartcampus.operationshub.dto.request.ticket;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AssignTechnicianRequest {

    @NotBlank(message = "Technician identifier is required")
    @Size(max = 120, message = "Technician identifier must not exceed 120 characters")
    private String technicianIdentifier;

    @NotBlank(message = "Technician name is required")
    @Size(max = 120, message = "Technician name must not exceed 120 characters")
    private String technicianName;

    @Email(message = "Technician email must be valid")
    @Size(max = 160, message = "Technician email must not exceed 160 characters")
    private String technicianEmail;
}
