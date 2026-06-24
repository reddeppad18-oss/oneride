package one.oneride.service.impl;

import lombok.RequiredArgsConstructor;
import one.oneride.entity.User;
import one.oneride.enums.UserRole;
import one.oneride.repository.UserRepository;
import one.oneride.service.UserService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public User createUserIfNotExists(String phoneNumber) {

        return userRepository
                .findByPhoneNumber(phoneNumber)
                .orElseGet(() -> {

                    User user = User.builder()
                            .phoneNumber(phoneNumber)
                            .role(UserRole.RIDER)
                            .verified(true)
                            .createdAt(LocalDateTime.now())
                            .build();

                    return userRepository.save(user);
                });
    }
}