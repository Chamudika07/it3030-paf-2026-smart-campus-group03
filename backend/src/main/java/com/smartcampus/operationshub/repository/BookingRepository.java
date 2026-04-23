package com.smartcampus.operationshub.repository;

import com.smartcampus.operationshub.entity.Booking;
import com.smartcampus.operationshub.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(String userId);
    List<Booking> findByResourceId(Long resourceId);
    List<Booking> findAllByOrderByCreatedAtDesc();
    boolean existsByResourceIdAndStatusInAndStartDateLessThanAndEndDateGreaterThan(
            Long resourceId,
            List<BookingStatus> statuses,
            java.time.LocalDateTime endDate,
            java.time.LocalDateTime startDate
    );
}
