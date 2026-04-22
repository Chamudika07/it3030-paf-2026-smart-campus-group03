package com.smartcampus.operationshub.service.impl;

import com.smartcampus.operationshub.dto.response.notification.NotificationResponse;
import com.smartcampus.operationshub.entity.AppUser;
import com.smartcampus.operationshub.entity.Notification;
import com.smartcampus.operationshub.enums.NotificationType;
import com.smartcampus.operationshub.exception.ForbiddenOperationException;
import com.smartcampus.operationshub.exception.ResourceNotFoundException;
import com.smartcampus.operationshub.repository.AppUserRepository;
import com.smartcampus.operationshub.repository.NotificationRepository;
import com.smartcampus.operationshub.service.AuthService;
import com.smartcampus.operationshub.service.NotificationService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final AppUserRepository appUserRepository;
    private final AuthService authService;

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getCurrentUserNotifications() {
        AppUser user = currentUser();
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public long getCurrentUserUnreadCount() {
        return notificationRepository.countByUserIdAndReadFalse(currentUser().getId());
    }

    @Override
    public NotificationResponse markAsRead(Long notificationId) {
        AppUser user = currentUser();
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + notificationId));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new ForbiddenOperationException("You can only update your own notifications");
        }

        notification.setRead(true);
        return toResponse(notificationRepository.save(notification));
    }

    @Override
    public void markAllAsRead() {
        AppUser user = currentUser();
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        notifications.forEach(notification -> notification.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    @Override
    public void notifyBookingApproved(Long userId, Long bookingId, String bookingTitle) {
        createForUserId(
                userId,
                "Booking approved",
                "Your booking \"" + safeLabel(bookingTitle, "booking") + "\" has been approved.",
                NotificationType.BOOKING_APPROVED,
                bookingId == null ? null : String.valueOf(bookingId)
        );
    }

    @Override
    public void notifyBookingRejected(Long userId, Long bookingId, String bookingTitle) {
        createForUserId(
                userId,
                "Booking rejected",
                "Your booking \"" + safeLabel(bookingTitle, "booking") + "\" has been rejected.",
                NotificationType.BOOKING_REJECTED,
                bookingId == null ? null : String.valueOf(bookingId)
        );
    }

    @Override
    public void notifyTicketStatusChangedByIdentifier(String userIdentifier, Long ticketId, String status) {
        createForUserIdentifier(
                userIdentifier,
                "Ticket status changed",
                "Ticket #" + ticketId + " status changed to " + safeLabel(status, "updated") + ".",
                NotificationType.TICKET_STATUS_CHANGED,
                ticketId == null ? null : String.valueOf(ticketId)
        );
    }

    @Override
    public void notifyNewCommentByIdentifier(String userIdentifier, Long ticketId, String commentAuthorName) {
        createForUserIdentifier(
                userIdentifier,
                "New ticket comment",
                safeLabel(commentAuthorName, "Someone") + " added a comment on ticket #" + ticketId + ".",
                NotificationType.NEW_COMMENT,
                ticketId == null ? null : String.valueOf(ticketId)
        );
    }

    private void createForUserId(Long userId, String title, String message, NotificationType type, String referenceId) {
        if (userId == null) {
            return;
        }
        appUserRepository.findById(userId)
                .ifPresent(user -> createNotification(user, title, message, type, referenceId));
    }

    private void createForUserIdentifier(String userIdentifier, String title, String message,
                                         NotificationType type, String referenceId) {
        if (userIdentifier == null || userIdentifier.isBlank()) {
            return;
        }
        appUserRepository.findByEmailIgnoreCase(userIdentifier)
                .ifPresent(user -> createNotification(user, title, message, type, referenceId));
    }

    private void createNotification(AppUser user, String title, String message, NotificationType type, String referenceId) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setReferenceId(referenceId);
        notificationRepository.save(notification);
    }

    private AppUser currentUser() {
        return authService.requireAuthenticatedUser(SecurityContextHolder.getContext().getAuthentication());
    }

    private NotificationResponse toResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .referenceId(notification.getReferenceId())
                .read(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }

    private String safeLabel(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value.trim();
    }
}
