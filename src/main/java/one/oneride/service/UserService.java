package one.oneride.service;

import one.oneride.entity.User;

public interface UserService {

    User createUserIfNotExists(
            String phoneNumber
    );
}