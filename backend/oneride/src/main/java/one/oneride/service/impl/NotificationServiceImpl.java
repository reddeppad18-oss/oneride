package one.oneride.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

import one.oneride.dto.NotificationResponse;
import one.oneride.entity.Notification;
import one.oneride.entity.User;
import one.oneride.enums.NotificationType;
import one.oneride.repository.NotificationRepository;
import one.oneride.repository.UserRepository;
import one.oneride.service.NotificationService;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl
        implements NotificationService {

    private final NotificationRepository notificationRepository;

    private final UserRepository userRepository;


    // =========================================================
    // CREATE NOTIFICATION
    // =========================================================

    @Override
    @Transactional
    public void createNotification(
            User user,
            String title,
            String message) {

        createNotification(
                user,
                title,
                message,
                NotificationType.GENERAL
        );
    }


    // =========================================================
    // CREATE NOTIFICATION WITH TYPE
    // =========================================================

    @Override
    @Transactional
    public void createNotification(
            User user,
            String title,
            String message,
            NotificationType type) {

        /*
         * Master notification setting
         */
        if (!Boolean.TRUE.equals(
                user.getNotificationsEnabled())) {

            return;
        }


        /*
         * Booking-specific notification setting
         */
        if (isBookingNotification(type)
                && !Boolean.TRUE.equals(
                        user.getBookingNotificationsEnabled())) {

            return;
        }


        /*
         * Ride-specific notification setting
         */
        if (type == NotificationType.RIDE_UPDATE
                && !Boolean.TRUE.equals(
                        user.getRideNotificationsEnabled())) {

            return;
        }


        Notification notification =
                Notification.builder()
                        .user(user)
                        .title(title)
                        .message(message)
                        .type(type)
                        .read(false)
                        .createdAt(LocalDateTime.now())
                        .build();


        notificationRepository.save(notification);
    }


    // =========================================================
    // GET MY NOTIFICATIONS
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getMyNotifications(
            String phoneNumber) {

        User user = getUser(phoneNumber);

        return notificationRepository
                .findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =========================================================
    // GET UNREAD NOTIFICATIONS
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getUnreadNotifications(
            String phoneNumber) {

        User user = getUser(phoneNumber);

        return notificationRepository
                .findByUserAndReadFalseOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =========================================================
    // GET UNREAD COUNT
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(
            String phoneNumber) {

        User user = getUser(phoneNumber);

        return notificationRepository
                .countByUserAndReadFalse(user);
    }


    // =========================================================
    // MARK ONE AS READ
    // =========================================================

    @Override
    @Transactional
    public void markAsRead(
            Long notificationId,
            String phoneNumber) {

        User user = getUser(phoneNumber);

        Notification notification =
                notificationRepository
                        .findById(notificationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found"
                                ));


        /*
         * Security check:
         * User can only modify their own notification.
         */
        if (!notification.getUser()
                .getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "Unauthorized"
            );
        }


        notification.setRead(true);

        notificationRepository.save(notification);
    }


    // =========================================================
    // MARK ALL AS READ
    // =========================================================

    @Override
    @Transactional
    public void markAllAsRead(
            String phoneNumber) {

        User user = getUser(phoneNumber);

        List<Notification> notifications =
                notificationRepository
                        .findByUserAndReadFalseOrderByCreatedAtDesc(
                                user
                        );


        for (Notification notification : notifications) {

            notification.setRead(true);
        }


        notificationRepository.saveAll(notifications);
    }


    // =========================================================
    // GET USER
    // =========================================================

    private User getUser(
            String phoneNumber) {

        return userRepository
                .findByPhoneNumber(phoneNumber)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        ));
    }


    // =========================================================
    // CHECK BOOKING NOTIFICATION
    // =========================================================

    private boolean isBookingNotification(
            NotificationType type) {

        return type == NotificationType.BOOKING_REQUEST
                || type == NotificationType.BOOKING_CONFIRMED
                || type == NotificationType.BOOKING_REJECTED
                || type == NotificationType.BOOKING_CANCELLED;
    }


    // =========================================================
    // MAP ENTITY → RESPONSE
    // =========================================================

    private NotificationResponse mapToResponse(
            Notification notification) {

        return new NotificationResponse(
                notification.getId(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getType().name(),
                notification.getRead(),
                notification.getCreatedAt()
        );
    }
}