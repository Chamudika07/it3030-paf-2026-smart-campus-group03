package com.smartcampus.operationshub.repository;

import com.smartcampus.operationshub.entity.Resource;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResourceRepository extends JpaRepository<Resource, Long> {
    boolean existsByCode(String code);
    Optional<Resource> findByCode(String code);
}

