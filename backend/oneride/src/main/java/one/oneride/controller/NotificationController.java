package one.oneride.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import one.oneride.dto.MessageResponse;
import one.oneride.dto.NotificationResponse;
import one.oneride.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin("*")
public class NotificationController {

    private final NotificationService notificationService;


    // =========================================================
    // GET ALL NOTIFICATIONS
    // =========================================================

    @GetMapping
    public List<NotificationResponse> getMyNotifications(
            Authentication authentication) {

        return notificationService.getMyNotifications(
                authentication.getName()
        );
    }


    // =========================================================
    // GET UNREAD NOTIFICATIONS
    // =========================================================

    @GetMapping("/unread")
    public List<NotificationResponse> getUnreadNotifications(
            Authentication authentication) {

        return notificationService.getUnreadNotifications(
                authentication.getName()
        );
    }


    // =========================================================
    // GET UNREAD COUNT
    // =========================================================

    @GetMapping("/unread-count")
    public long getUnreadCount(
            Authentication authentication) {

        return notificationService.getUnreadCount(
                authentication.getName()
        );
    }


    // =========================================================
    // MARK ONE AS READ
    // =========================================================

    @PutMapping("/{notificationId}/read")
    public MessageResponse markAsRead(
            @PathVariable Long notificationId,
            Authentication authentication) {

        notificationService.markAsRead(
                notificationId,
                authentication.getName()
        );

        return MessageResponse.builder()
                .message(
                        "Notification marked as read"
                )
                .build();
    }


    // =========================================================
    // MARK ALL AS READ
    // =========================================================

    @PutMapping("/read-all")
    public MessageResponse markAllAsRead(
            Authentication authentication) {

        notificationService.markAllAsRead(
                authentication.getName()
        );

        return MessageResponse.builder()
                .message(
                        "All notifications marked as read"
                )
                .build();
    }
}