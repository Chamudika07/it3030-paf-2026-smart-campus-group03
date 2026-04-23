package com.smartcampus.operationshub.controller;

import com.smartcampus.operationshub.dto.request.CreateResourceRequest;
import com.smartcampus.operationshub.dto.request.UpdateResourceRequest;
import com.smartcampus.operationshub.dto.response.ApiResponse;
import com.smartcampus.operationshub.dto.response.ResourceResponse;
import com.smartcampus.operationshub.enums.ResourceCategory;
import com.smartcampus.operationshub.service.ResourceService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;

    @PostMapping
    public ResponseEntity<ApiResponse<ResourceResponse>> createResource(
            @Valid @RequestBody CreateResourceRequest request) {
        ResourceResponse response = resourceService.createResource(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>("Resource created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ResourceResponse>>> getAllResources() {
        return ResponseEntity.ok(new ApiResponse<>("Resources fetched successfully", resourceService.getAllResources()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ResourceResponse>> getResourceById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>("Resource fetched successfully", resourceService.getResourceById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ResourceResponse>> updateResource(@PathVariable Long id,
                                                                        @Valid @RequestBody UpdateResourceRequest request) {
        return ResponseEntity.ok(new ApiResponse<>("Resource updated successfully", resourceService.updateResource(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ResourceResponse>>> searchResources(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) ResourceCategory category,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) Boolean active) {
        
        List<ResourceResponse> results = resourceService.searchResources(query, category, location, minCapacity, active);
        return ResponseEntity.ok(new ApiResponse<>("Search completed", results));
    }
}

