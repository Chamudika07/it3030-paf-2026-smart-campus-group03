package com.smartcampus.operationshub.service.impl;

import com.smartcampus.operationshub.dto.request.CreateResourceRequest;
import com.smartcampus.operationshub.dto.request.UpdateResourceRequest;
import com.smartcampus.operationshub.dto.response.ResourceResponse;
import com.smartcampus.operationshub.entity.Resource;
import com.smartcampus.operationshub.enums.ResourceCategory;
import com.smartcampus.operationshub.exception.DuplicateResourceException;
import com.smartcampus.operationshub.exception.ResourceNotFoundException;
import com.smartcampus.operationshub.repository.ResourceRepository;
import com.smartcampus.operationshub.service.ResourceService;
import com.smartcampus.operationshub.util.ResourceMapper;
import java.util.List;
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

        Resource resource = ResourceMapper.toEntity(request);
        return ResourceMapper.toResponse(resourceRepository.save(resource));
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
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
        return ResourceMapper.toResponse(resource);
    }

    @Override
    public ResourceResponse updateResource(Long id, UpdateResourceRequest request) {
        Resource resource = resourceRepository.findById(id)
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
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
        resourceRepository.delete(resource);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResourceResponse> searchResources(
            String query,
            ResourceCategory category,
            String location,
            Integer minCapacity,
            Boolean active) {
        
        return resourceRepository.searchResources(query, category, location, minCapacity, active)
                .stream()
                .map(ResourceMapper::toResponse)
                .toList();
    }
}

