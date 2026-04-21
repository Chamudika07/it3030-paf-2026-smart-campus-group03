package com.smartcampus.operationshub.service.impl;

import com.smartcampus.operationshub.dto.request.CreateResourceRequest;
import com.smartcampus.operationshub.dto.request.UpdateResourceRequest;
import com.smartcampus.operationshub.dto.response.ResourceResponse;
import com.smartcampus.operationshub.entity.Resource;
import com.smartcampus.operationshub.exception.DuplicateResourceException;
import com.smartcampus.operationshub.exception.ResourceNotFoundException;
import com.smartcampus.operationshub.repository.ResourceRepository;
import com.smartcampus.operationshub.service.ResourceService;
import com.smartcampus.operationshub.util.ResourceMapper;
import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;

    @Override
    public ResourceResponse createResource(CreateResourceRequest request) {
        if (resourceRepository.existsByCode(request.getCode())) {
            throw new DuplicateResourceException("Resource code already exists: " + request.getCode());
        }

        Resource resource = Objects.requireNonNull(
                ResourceMapper.toEntity(request),
                "Mapped resource must not be null"
        );
        Resource savedResource = resourceRepository.save(resource);
        return ResourceMapper.toResponse(savedResource);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResourceResponse> getAllResources() {
        return resourceRepository.findAll()
                .stream()
                .map(ResourceMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ResourceResponse getResourceById(Long id) {
        Long safeId = Objects.requireNonNull(id, "Resource id must not be null");
        Resource resource = resourceRepository.findById(safeId)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
        return ResourceMapper.toResponse(resource);
    }

    @Override
    public ResourceResponse updateResource(Long id, UpdateResourceRequest request) {
        Long safeId = Objects.requireNonNull(id, "Resource id must not be null");
        Resource resource = resourceRepository.findById(safeId)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));

        resource.setName(request.getName());
        resource.setCategory(request.getCategory());
        resource.setLocation(request.getLocation());
        resource.setCapacity(request.getCapacity());
        resource.setActive(request.getActive());

        return ResourceMapper.toResponse(resourceRepository.save(resource));
    }

    @Override
    public void deleteResource(Long id) {
        Long safeId = Objects.requireNonNull(id, "Resource id must not be null");
        Resource resource = resourceRepository.findById(safeId)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
        resourceRepository.delete(Objects.requireNonNull(resource, "Resource to delete must not be null"));
    }
}

