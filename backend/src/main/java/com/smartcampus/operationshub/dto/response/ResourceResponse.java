package com.smartcampus.operationshub.dto.response;

import com.smartcampus.operationshub.enums.ResourceCategory;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ResourceResponse {
    private Long id;
    private String code;
    private String name;
    private ResourceCategory category;
    private String location;
    private Integer capacity;
    private Boolean active;
}

