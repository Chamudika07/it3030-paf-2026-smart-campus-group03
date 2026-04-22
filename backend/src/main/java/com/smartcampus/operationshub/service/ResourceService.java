package com.smartcampus.operationshub.service;

import com.smartcampus.operationshub.dto.request.CreateResourceRequest;
import com.smartcampus.operationshub.dto.request.UpdateResourceRequest;
import com.smartcampus.operationshub.dto.response.ResourceResponse;
import java.util.List;

public interface ResourceService {
    ResourceResponse createResource(CreateResourceRequest request);
    List<ResourceResponse> getAllResources();
    ResourceResponse getResourceById(Long id);
    ResourceResponse updateResource(Long id, UpdateResourceRequest request);
    void deleteResource(Long id);
}

