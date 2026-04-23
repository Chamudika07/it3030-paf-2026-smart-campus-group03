package com.smartcampus.operationshub.repository;

import com.smartcampus.operationshub.entity.Resource;
import com.smartcampus.operationshub.enums.ResourceCategory;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ResourceRepository extends JpaRepository<Resource, Long> {
    boolean existsByCode(String code);
    Optional<Resource> findByCode(String code);
    
    // Search and filter methods
    List<Resource> findByNameContainingIgnoreCaseOrCodeContainingIgnoreCase(String name, String code);
    List<Resource> findByCategory(ResourceCategory category);
    List<Resource> findByLocationContainingIgnoreCase(String location);
    List<Resource> findByCapacityGreaterThanEqual(Integer minCapacity);
    List<Resource> findByActive(Boolean active);
    
    // Complex search with multiple filters
    @Query("SELECT r FROM Resource r WHERE " +
           "(:query = '' OR LOWER(r.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(r.code) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(cast(:category as string) IS NULL OR r.category = :category) AND " +
           "(:location = '' OR LOWER(r.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:minCapacity IS NULL OR r.capacity >= :minCapacity) AND " +
           "(:active IS NULL OR r.active = :active) " +
           "ORDER BY r.id DESC")
    List<Resource> searchResources(
        @Param("query") String query,
        @Param("category") ResourceCategory category,
        @Param("location") String location,
        @Param("minCapacity") Integer minCapacity,
        @Param("active") Boolean active);
}

