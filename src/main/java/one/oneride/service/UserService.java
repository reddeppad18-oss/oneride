package one.oneride.service;

import one.oneride.dto.UserResponse;
import one.oneride.entity.User;

public interface UserService {

    User createUserIfNotExists(
            String phoneNumber
    );
    UserResponse getCurrentUser(String phoneNumber);
}