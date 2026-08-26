package one.oneride.controller;

import lombok.RequiredArgsConstructor;
import one.oneride.dto.MessageResponse;
import one.oneride.dto.NotificationResponse;
import one.oneride.service.NotificationService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin("*")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public List<NotificationResponse> getMyNotifications(
            Authentication authentication) {

        return notificationService.getMyNotifications(
                authentication.getName()
        );
    }

    @PutMapping("/{notificationId}/read")
    public MessageResponse markAsRead(
            @PathVariable Long notificationId,
            Authentication authentication) {

        return notificationService.markAsRead(
                notificationId,
                authentication.getName()
        );
    }
}