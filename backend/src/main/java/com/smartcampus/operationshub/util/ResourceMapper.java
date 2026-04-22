package com.smartcampus.operationshub.util;

import com.smartcampus.operationshub.dto.request.CreateResourceRequest;
import com.smartcampus.operationshub.dto.response.ResourceResponse;
import com.smartcampus.operationshub.entity.Resource;

public final class ResourceMapper {

    private ResourceMapper() {
    }

    public static Resource toEntity(CreateResourceRequest request) {
        Resource resource = new Resource();
        resource.setCode(request.getCode().trim().toUpperCase());
        resource.setName(request.getName().trim());
        resource.setCategory(request.getCategory());
        resource.setLocation(request.getLocation().trim());
        resource.setCapacity(request.getCapacity());
        resource.setActive(true);
        return resource;
    }

    public static ResourceResponse toResponse(Resource resource) {
        return ResourceResponse.builder()
                .id(resource.getId())
                .code(resource.getCode())
                .name(resource.getName())
                .category(resource.getCategory())
                .location(resource.getLocation())
                .capacity(resource.getCapacity())
                .active(resource.getActive())
                .build();
    }
}

