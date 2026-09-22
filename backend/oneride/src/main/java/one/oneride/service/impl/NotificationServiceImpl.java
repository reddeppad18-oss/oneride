package one.oneride.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.messaging.simp.SimpMessagingTemplate;
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

    private final NotificationRepository
            notificationRepository;

    private final UserRepository userRepository;

    private final SimpMessagingTemplate
            messagingTemplate;

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

    @Override
    @Transactional
    public void createNotification(
            User user,
            String title,
            String message,
            NotificationType type) {

        if (user == null) {
            return;
        }

        if (Boolean.FALSE.equals(
                user.getNotificationsEnabled())) {

            return;
        }

        NotificationType notificationType =
                type != null
                        ? type
                        : NotificationType.GENERAL;

        if (isBookingNotification(notificationType)
                && Boolean.FALSE.equals(
                        user.getBookingNotificationsEnabled())) {

            return;
        }

        if (notificationType ==
                NotificationType.RIDE_UPDATE
                && Boolean.FALSE.equals(
                        user.getRideNotificationsEnabled())) {

            return;
        }

        String notificationTitle = title;

        if (notificationTitle == null
                || notificationTitle.isBlank()) {

            notificationTitle =
                    getDefaultTitle(notificationType);
        }

        String notificationMessage = message;

        if (notificationMessage == null
                || notificationMessage.isBlank()) {

            notificationMessage =
                    "You have a new notification.";
        }

        Notification notification =
                Notification.builder()
                        .user(user)
                        .title(notificationTitle)
                        .message(notificationMessage)
                        .type(notificationType)
                        .read(false)
                        .createdAt(LocalDateTime.now())
                        .build();

        Notification saved =
                notificationRepository.save(notification);

        NotificationResponse response =
                mapToResponse(saved);

        /*
         * Persisted notification is created first.
         * Then deliver it to the connected user in real time.
         */
        try {

            messagingTemplate.convertAndSendToUser(
                    user.getPhoneNumber(),
                    "/queue/notifications",
                    response
            );

        } catch (Exception e) {

            /*
             * Real-time delivery failure must not destroy
             * the persisted notification.
             */
            System.err.println(
                    "WebSocket notification delivery failed: "
                            + e.getMessage()
            );
        }
    }

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

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(
            String phoneNumber) {

        User user = getUser(phoneNumber);

        return notificationRepository
                .countByUserAndReadFalse(user);
    }

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
                                )
                        );

        if (notification.getUser() == null
                || notification.getUser().getId() == null
                || user.getId() == null
                || !notification.getUser()
                        .getId()
                        .equals(user.getId())) {

            throw new RuntimeException(
                    "Unauthorized"
            );
        }

        notification.setRead(true);

        notificationRepository.save(notification);
    }

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

        if (notifications.isEmpty()) {
            return;
        }

        for (Notification notification :
                notifications) {

            notification.setRead(true);
        }

        notificationRepository.saveAll(notifications);
    }

    private User getUser(String phoneNumber) {

        if (phoneNumber == null
                || phoneNumber.isBlank()) {

            throw new RuntimeException(
                    "Authenticated phone number is missing"
            );
        }

        return userRepository
                .findByPhoneNumber(phoneNumber)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found for phone number: "
                                        + phoneNumber
                        )
                );
    }

    private boolean isBookingNotification(
            NotificationType type) {

        if (type == null) {
            return false;
        }

        return type == NotificationType.BOOKING_REQUEST
                || type == NotificationType.BOOKING_CONFIRMED
                || type == NotificationType.BOOKING_REJECTED
                || type == NotificationType.BOOKING_CANCELLED;
    }

    private String getDefaultTitle(
            NotificationType type) {

        if (type == null) {
            return "New Notification";
        }

        switch (type) {

            case BOOKING_REQUEST:
                return "New Booking Request";

            case BOOKING_CONFIRMED:
                return "Booking Confirmed";

            case BOOKING_REJECTED:
                return "Booking Rejected";

            case BOOKING_CANCELLED:
                return "Booking Cancelled";

            case RIDE_UPDATE:
                return "Ride Update";

            case GENERAL:
            default:
                return "New Notification";
        }
    }

    private NotificationResponse mapToResponse(
            Notification notification) {

        String type =
                notification.getType() != null
                        ? notification.getType().name()
                        : NotificationType.GENERAL.name();

        String title =
                notification.getTitle();

        if (title == null
                || title.isBlank()) {

            title = getDefaultTitle(
                    notification.getType()
            );
        }

        String message =
                notification.getMessage();

        if (message == null
                || message.isBlank()) {

            message =
                    "You have a new notification.";
        }

        boolean read =
                Boolean.TRUE.equals(
                        notification.getRead()
                );

        return new NotificationResponse(
                notification.getId(),
                title,
                message,
                type,
                read,
                notification.getCreatedAt()
        );
    }
}