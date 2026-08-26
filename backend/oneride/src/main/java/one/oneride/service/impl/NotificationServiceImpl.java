package one.oneride.service.impl;

import lombok.RequiredArgsConstructor;
import one.oneride.dto.MessageResponse;
import one.oneride.dto.NotificationResponse;
import one.oneride.entity.Notification;
import one.oneride.entity.User;
import one.oneride.repository.NotificationRepository;
import one.oneride.repository.UserRepository;
import one.oneride.service.NotificationService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    public void createNotification(
            User user,
            String title,
            String message) {

        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);
    }

    @Override
    public List<NotificationResponse> getMyNotifications(
            String phoneNumber) {

        User user = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return notificationRepository
                .findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(notification ->
                        NotificationResponse.builder()
                                .id(notification.getId())
                                .title(notification.getTitle())
                                .message(notification.getMessage())
                                .isRead(notification.getIsRead())
                                .createdAt(notification.getCreatedAt())
                                .build())
                .toList();
    }

    @Override
    public MessageResponse markAsRead(
            Long notificationId,
            String phoneNumber) {

        User user = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Notification notification = notificationRepository
                .findById(notificationId)
                .orElseThrow(() ->
                        new RuntimeException("Notification not found"));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        notification.setIsRead(true);

        notificationRepository.save(notification);

        return MessageResponse.builder()
                .message("Notification marked as read")
                .build();
    }
}