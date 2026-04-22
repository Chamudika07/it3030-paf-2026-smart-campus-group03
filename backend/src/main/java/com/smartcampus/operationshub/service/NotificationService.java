package com.smartcampus.operationshub.service;

import com.smartcampus.operationshub.dto.response.notification.NotificationResponse;
import java.util.List;

public interface NotificationService {
    List<NotificationResponse> getCurrentUserNotifications();

    long getCurrentUserUnreadCount();

    NotificationResponse markAsRead(Long notificationId);

    void markAllAsRead();

    void notifyBookingApproved(Long userId, Long bookingId, String bookingTitle);

    void notifyBookingRejected(Long userId, Long bookingId, String bookingTitle);

    void notifyTicketStatusChangedByIdentifier(String userIdentifier, Long ticketId, String status);

    void notifyNewCommentByIdentifier(String userIdentifier, Long ticketId, String commentAuthorName);
}
