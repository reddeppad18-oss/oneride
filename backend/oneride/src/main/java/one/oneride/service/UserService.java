package one.oneride.service;

import one.oneride.dto.UpdateProfileRequest;
import one.oneride.dto.UserResponse;
import one.oneride.entity.User;

public interface UserService {

    User createUserIfNotExists(
            String phoneNumber
    );

    UserResponse getCurrentUser(
            String phoneNumber
    );

    UserResponse getPublicProfile(
            Long userId
    );

    void updateProfile(
            String phoneNumber,
            UpdateProfileRequest request
    );
}
