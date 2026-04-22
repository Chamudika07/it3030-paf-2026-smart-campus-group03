package com.smartcampus.operationshub.controller;

import com.smartcampus.operationshub.dto.response.ApiResponse;
import com.smartcampus.operationshub.dto.response.notification.NotificationResponse;
import com.smartcampus.operationshub.service.NotificationService;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getNotifications() {
        return ResponseEntity.ok(new ApiResponse<>(
                "Notifications fetched successfully",
                notificationService.getCurrentUserNotifications()
        ));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount() {
        return ResponseEntity.ok(new ApiResponse<>(
                "Unread notification count fetched successfully",
                Map.of("count", notificationService.getCurrentUserUnreadCount())
        ));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<NotificationResponse>> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(
                "Notification marked as read",
                notificationService.markAsRead(id)
        ));
    }

    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead() {
        notificationService.markAllAsRead();
        return ResponseEntity.ok(new ApiResponse<>("All notifications marked as read", null));
    }
}
