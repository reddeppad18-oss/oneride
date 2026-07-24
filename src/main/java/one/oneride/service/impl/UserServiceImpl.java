package one.oneride.service.impl;

import lombok.RequiredArgsConstructor;
import one.oneride.dto.UpdateProfileRequest;
import one.oneride.dto.UserResponse;
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

        System.out.println("====================================");
        System.out.println("PHONE RECEIVED : " + phoneNumber);
        System.out.println("====================================");

        return userRepository.findByPhoneNumber(phoneNumber)
                .orElseGet(() -> {

                    User user = User.builder()
                            .phoneNumber(phoneNumber)
                            .role(UserRole.RIDER)
                            .verified(true)
                            .createdAt(LocalDateTime.now())
                            .build();

                    System.out.println("====================================");
                    System.out.println("USER BEFORE SAVE");
                    System.out.println("Phone : " + user.getPhoneNumber());
                    System.out.println("Role  : " + user.getRole());
                    System.out.println("Verified : " + user.getVerified());
                    System.out.println("====================================");

                    return userRepository.save(user);
                });
    }

    @Override
    public UserResponse getCurrentUser(String phoneNumber) {

        User user = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole().name())
                .verified(user.getVerified())
                .build();
    }
    @Override
    public void updateProfile(
            String phoneNumber,
            UpdateProfileRequest request) {

        User user = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        user.setFullName(request.getFullName());

        userRepository.save(user);
    }
}