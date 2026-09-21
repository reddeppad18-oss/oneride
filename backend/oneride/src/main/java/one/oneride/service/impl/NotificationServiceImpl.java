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
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

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

        /*
         * If notifications are explicitly disabled,
         * do not create the notification.
         *
         * NULL is treated as enabled for compatibility
         * with older users/settings.
         */
        if (Boolean.FALSE.equals(user.getNotificationsEnabled())) {
            return;
        }

        /*
         * Never allow a NULL notification type.
         * Older code/data may pass NULL, so use GENERAL.
         */
        NotificationType notificationType =
                type != null
                        ? type
                        : NotificationType.GENERAL;

        /*
         * Booking notification settings
         */
        if (isBookingNotification(notificationType)
                && Boolean.FALSE.equals(
                        user.getBookingNotificationsEnabled())) {

            return;
        }

        /*
         * Ride notification settings
         */
        if (notificationType == NotificationType.RIDE_UPDATE
                && Boolean.FALSE.equals(
                        user.getRideNotificationsEnabled())) {

            return;
        }

        Notification notification =
                Notification.builder()
                        .user(user)
                        .title(title)
                        .message(message)
                        .type(notificationType)
                        .read(false)
                        .createdAt(LocalDateTime.now())
                        .build();

        notificationRepository.save(notification);
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
    public long getUnreadCount(String phoneNumber) {

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
                                ));

        /*
         * Make sure the notification belongs
         * to the currently authenticated user.
         */
        if (notification.getUser() == null
                || notification.getUser().getId() == null
                || user.getId() == null
                || !notification.getUser()
                        .getId()
                        .equals(user.getId())) {

            throw new RuntimeException("Unauthorized");
        }

        notification.setRead(true);

        notificationRepository.save(notification);
    }

    @Override
    @Transactional
    public void markAllAsRead(String phoneNumber) {

        User user = getUser(phoneNumber);

        List<Notification> notifications =
                notificationRepository
                        .findByUserAndReadFalseOrderByCreatedAtDesc(
                                user
                        );

        if (notifications.isEmpty()) {
            return;
        }

        for (Notification notification : notifications) {
            notification.setRead(true);
        }

        notificationRepository.saveAll(notifications);
    }

    /**
     * Find the authenticated user using the phone number
     * stored as the JWT subject.
     */
    private User getUser(String phoneNumber) {

        if (phoneNumber == null || phoneNumber.isBlank()) {

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
                        ));
    }

    /**
     * Determines whether the notification is related
     * to a booking.
     */
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

    /**
     * Converts Notification entity to NotificationResponse.
     *
     * IMPORTANT:
     * Some older database records have NULL in the
     * notification type column. Those records are treated
     * as GENERAL instead of causing a NullPointerException.
     */
    private NotificationResponse mapToResponse(
            Notification notification) {

        String type =
                notification.getType() != null
                        ? notification.getType().name()
                        : NotificationType.GENERAL.name();

        boolean read =
                Boolean.TRUE.equals(
                        notification.getRead()
                );

        return new NotificationResponse(
                notification.getId(),
                notification.getTitle(),
                notification.getMessage(),
                type,
                read,
                notification.getCreatedAt()
        );
    }
}