package one.oneride.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import one.oneride.dto.MessageResponse;
import one.oneride.dto.SettingsResponse;
import one.oneride.dto.UpdateProfileRequest;
import one.oneride.dto.UpdateSettingsRequest;
import one.oneride.dto.UserResponse;
import one.oneride.service.UserService;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin("*")
public class UserController {

    private final UserService userService;

    /*
     * GET CURRENT USER
     */

    @GetMapping("/me")
    public UserResponse getCurrentUser(
            Authentication authentication) {

        String phoneNumber = authentication.getName();

        return userService.getCurrentUser(phoneNumber);
    }

    /*
     * GET PUBLIC PROFILE
     */

    @GetMapping("/public/{userId}")
    public UserResponse getPublicProfile(
            @PathVariable Long userId) {

        return userService.getPublicProfile(userId);
    }

    /*
     * UPDATE PROFILE
     */

    @PutMapping("/profile")
    public MessageResponse updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request) {

        String phoneNumber = authentication.getName();

        userService.updateProfile(
                phoneNumber,
                request
        );

        return MessageResponse.builder()
                .message("Profile updated successfully")
                .build();
    }

    /*
     * GET SETTINGS
     */

    @GetMapping("/settings")
    public SettingsResponse getSettings(
            Authentication authentication) {

        String phoneNumber = authentication.getName();

        return userService.getSettings(phoneNumber);
    }

    /*
     * UPDATE SETTINGS
     */

    @PutMapping("/settings")
    public MessageResponse updateSettings(
            Authentication authentication,
            @Valid @RequestBody UpdateSettingsRequest request) {

        String phoneNumber = authentication.getName();

        userService.updateSettings(
                phoneNumber,
                request
        );

        return MessageResponse.builder()
                .message("Settings updated successfully")
                .build();
    }
}