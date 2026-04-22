package com.smartcampus.operationshub.service;

import com.smartcampus.operationshub.entity.Notification;
import com.smartcampus.operationshub.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public void sendNotification(String email, String message) {
        Notification notification = new Notification();
        notification.setMessage(message);
        notification.setUserEmail(email);
        notification.setIsRead(false);
        notificationRepository.save(notification);
    }

    public List<Notification> getNotifications(String email) {
        return notificationRepository.findByUserEmailAndIsReadFalse(email);  // Fetch unread notifications
    }

    public void markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id).orElseThrow();
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }
}
