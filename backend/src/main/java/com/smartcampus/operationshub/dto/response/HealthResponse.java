package com.smartcampus.operationshub.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class HealthResponse {
    private String status;
    private String service;
}

