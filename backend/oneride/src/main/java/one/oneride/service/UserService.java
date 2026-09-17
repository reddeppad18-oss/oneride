package one.oneride.service;

import one.oneride.dto.SettingsResponse;
import one.oneride.dto.UpdateProfileRequest;
import one.oneride.dto.UpdateSettingsRequest;
import one.oneride.dto.UserResponse;
import one.oneride.entity.User;

public interface UserService {

    User createUserIfNotExists(String phoneNumber);

    UserResponse getCurrentUser(String phoneNumber);

    void updateProfile(
            String phoneNumber,
            UpdateProfileRequest request
    );

    UserResponse getPublicProfile(Long userId);

    /*
     * Settings
     */

    SettingsResponse getSettings(
            String phoneNumber
    );

    void updateSettings(
            String phoneNumber,
            UpdateSettingsRequest request
    );
}