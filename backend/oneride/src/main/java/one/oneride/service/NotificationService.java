package one.oneride.service;

import java.util.List;

import one.oneride.dto.NotificationResponse;
import one.oneride.entity.User;
import one.oneride.enums.NotificationType;

public interface NotificationService {

    // =========================================================
    // CREATE GENERAL NOTIFICATION
    // =========================================================

    void createNotification(
            User user,
            String title,
            String message
    );

    // =========================================================
    // CREATE NOTIFICATION WITH TYPE
    // =========================================================

    void createNotification(
            User user,
            String title,
            String message,
            NotificationType type
    );

    // =========================================================
    // GET ALL NOTIFICATIONS
    // =========================================================

    List<NotificationResponse> getMyNotifications(
            String phoneNumber
    );

    // =========================================================
    // GET UNREAD NOTIFICATIONS
    // =========================================================

    List<NotificationResponse> getUnreadNotifications(
            String phoneNumber
    );

    // =========================================================
    // GET UNREAD COUNT
    // =========================================================

    long getUnreadCount(
            String phoneNumber
    );

    // =========================================================
    // MARK ONE AS READ
    // =========================================================

    void markAsRead(
            Long notificationId,
            String phoneNumber
    );

    // =========================================================
    // MARK ALL AS READ
    // =========================================================

    void markAllAsRead(
            String phoneNumber
    );
}