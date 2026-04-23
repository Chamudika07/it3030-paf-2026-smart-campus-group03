package com.smartcampus.operationshub.service;

import com.smartcampus.operationshub.dto.request.CreateResourceRequest;
import com.smartcampus.operationshub.dto.request.UpdateResourceRequest;
import com.smartcampus.operationshub.dto.response.ResourceResponse;
import com.smartcampus.operationshub.enums.ResourceCategory;
import java.util.List;

public interface ResourceService {
    ResourceResponse createResource(CreateResourceRequest request);
    List<ResourceResponse> getAllResources();
    ResourceResponse getResourceById(Long id);
    ResourceResponse updateResource(Long id, UpdateResourceRequest request);
    void deleteResource(Long id);
    
    // Search and filter
    List<ResourceResponse> searchResources(
        String query,
        ResourceCategory category,
        String location,
        Integer minCapacity,
        Boolean active);
}

