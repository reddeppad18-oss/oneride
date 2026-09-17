package one.oneride.service;

import java.util.List;

import one.oneride.dto.NotificationResponse;
import one.oneride.entity.User;
import one.oneride.enums.NotificationType;

public interface NotificationService {

    /*
     * Existing method used by BookingServiceImpl.
     *
     * This keeps your current booking code working.
     */
    void createNotification(
            User user,
            String title,
            String message
    );

    /*
     * Create notification with explicit type.
     */
    void createNotification(
            User user,
            String title,
            String message,
            NotificationType type
    );

    /*
     * Get all notifications for a user.
     */
    List<NotificationResponse> getMyNotifications(
            String phoneNumber
    );

    /*
     * Get unread notifications.
     */
    List<NotificationResponse> getUnreadNotifications(
            String phoneNumber
    );

    /*
     * Get unread notification count.
     */
    long getUnreadCount(
            String phoneNumber
    );

    /*
     * Mark one notification as read.
     */
    void markAsRead(
            Long notificationId,
            String phoneNumber
    );

    /*
     * Mark all notifications as read.
     */
    void markAllAsRead(
            String phoneNumber
    );
}