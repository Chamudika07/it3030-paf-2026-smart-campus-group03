package com.smartcampus.operationshub.dto.request;

import com.smartcampus.operationshub.enums.ResourceCategory;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateResourceRequest {

    @NotBlank
    @Size(max = 120)
    private String code;

    @NotBlank
    @Size(max = 150)
    private String name;

    @NotNull
    private ResourceCategory category;

    @NotBlank
    @Size(max = 120)
    private String location;

    @NotNull
    @Min(1)
    private Integer capacity;
}

