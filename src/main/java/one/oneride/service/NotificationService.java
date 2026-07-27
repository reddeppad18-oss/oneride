package one.oneride.service;

import one.oneride.dto.MessageResponse;
import one.oneride.dto.NotificationResponse;
import one.oneride.entity.User;

import java.util.List;

public interface NotificationService {

    void createNotification(
            User user,
            String title,
            String message
    );

    List<NotificationResponse> getMyNotifications(
            String phoneNumber
    );

    MessageResponse markAsRead(
            Long notificationId,
            String phoneNumber
    );
}