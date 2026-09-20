package one.oneride.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import one.oneride.dto.SettingsResponse;
import one.oneride.dto.UpdateProfileRequest;
import one.oneride.dto.UpdateSettingsRequest;
import one.oneride.dto.UserResponse;
import one.oneride.entity.Language;
import one.oneride.entity.User;
import one.oneride.repository.RatingRepository;
import one.oneride.repository.UserRepository;
import one.oneride.service.UserService;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final RatingRepository ratingRepository;

    /*
     * CREATE USER
     */

    @Override
    @Transactional
    public User createUserIfNotExists(String phoneNumber) {

        return userRepository
                .findByPhoneNumber(phoneNumber)
                .orElseGet(() -> {

                    User user = User.builder()
                            .phoneNumber(phoneNumber)
                            .verified(true)

                            // Default Settings
                            .notificationsEnabled(true)
                            .bookingNotificationsEnabled(true)
                            .rideNotificationsEnabled(true)
                            .language("English")

                            .build();

                    return userRepository.save(user);
                });
    }

    /*
     * GET CURRENT USER
     */

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(
            String phoneNumber) {

        User user = userRepository
                .findByPhoneNumber(phoneNumber)
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found"
                        )
                );

        return buildUserResponse(user);
    }

    /*
     * UPDATE PROFILE
     */

    @Override
    @Transactional
    public void updateProfile(
            String phoneNumber,
            UpdateProfileRequest request) {

        User user = userRepository
                .findByPhoneNumber(phoneNumber)
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found"
                        )
                );

        user.setFullName(
                request.getFullName()
        );

        user.setCity(
                request.getCity()
        );

        user.setAboutMe(
                request.getAboutMe()
        );

        user.setProfilePhotoUrl(
                request.getProfilePhotoUrl()
        );

        userRepository.save(user);
    }

    /*
     * GET PUBLIC PROFILE
     */

    @Override
    @Transactional(readOnly = true)
    public UserResponse getPublicProfile(
            Long userId) {

        User user = userRepository
                .findById(userId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found"
                        )
                );

        return buildUserResponse(user);
    }

    /*
     * GET SETTINGS
     */

    @Override
    @Transactional
    public SettingsResponse getSettings(
            String phoneNumber) {

        User user = userRepository
                .findByPhoneNumber(phoneNumber)
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found"
                        )
                );

        /*
         * Existing users may have NULL values
         * because these fields were added later.
         *
         * Initialize safe defaults and persist
         * them to PostgreSQL.
         */

        boolean changed = false;

        if (user.getNotificationsEnabled() == null) {
            user.setNotificationsEnabled(true);
            changed = true;
        }

        if (user.getBookingNotificationsEnabled() == null) {
            user.setBookingNotificationsEnabled(true);
            changed = true;
        }

        if (user.getRideNotificationsEnabled() == null) {
            user.setRideNotificationsEnabled(true);
            changed = true;
        }

        if (user.getLanguage() == null
                || user.getLanguage().isBlank()) {

            user.setLanguage("English");
            changed = true;
        }

        if (changed) {
            userRepository.save(user);
        }

        return new SettingsResponse(
                user.getNotificationsEnabled(),
                user.getBookingNotificationsEnabled(),
                user.getRideNotificationsEnabled(),
                user.getLanguage()
        );
    }

    /*
     * UPDATE SETTINGS
     */

    @Override
    @Transactional
    public void updateSettings(
            String phoneNumber,
            UpdateSettingsRequest request) {

        User user = userRepository
                .findByPhoneNumber(phoneNumber)
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found"
                        )
                );

        /*
         * Push Notifications
         */

        if (request.getNotificationsEnabled() != null) {

            user.setNotificationsEnabled(
                    request.getNotificationsEnabled()
            );

            /*
             * If push notifications are disabled,
             * disable the child notification types too.
             */

            if (!request.getNotificationsEnabled()) {

                user.setBookingNotificationsEnabled(false);
                user.setRideNotificationsEnabled(false);
            }
        }

        /*
         * Booking Notifications
         */

        if (request.getBookingNotificationsEnabled() != null
                && Boolean.TRUE.equals(
                        user.getNotificationsEnabled())) {

            user.setBookingNotificationsEnabled(
                    request.getBookingNotificationsEnabled()
            );
        }

        /*
         * Ride Notifications
         */

        if (request.getRideNotificationsEnabled() != null
                && Boolean.TRUE.equals(
                        user.getNotificationsEnabled())) {

            user.setRideNotificationsEnabled(
                    request.getRideNotificationsEnabled()
            );
        }

        /*
         * Language
         */

        if (request.getLanguage() != null
                && !request.getLanguage().isBlank()) {

            user.setLanguage(
                    request.getLanguage()
            );
        }

        /*
         * Save changes to PostgreSQL
         */

        userRepository.save(user);
    }

    /*
     * BUILD USER RESPONSE
     */

    private UserResponse buildUserResponse(
            User user) {

        List<?> ratings =
                ratingRepository.findByReviewee(user);

        double averageRating =
                ratings
                        .stream()
                        .mapToDouble(rating -> {

                            try {

                                return ((Number)
                                        rating.getClass()
                                                .getMethod(
                                                        "getRating"
                                                )
                                                .invoke(rating))
                                        .doubleValue();

                            } catch (Exception e) {

                                return 0.0;
                            }
                        })
                        .average()
                        .orElse(0.0);

        List<String> languageNames =
                user.getLanguages()
                        .stream()
                        .map(Language::getName)
                        .toList();

        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .role(
                        user.getRole() != null
                                ? user.getRole().name()
                                : null
                )
                .verified(user.getVerified())
                .city(user.getCity())
                .aboutMe(user.getAboutMe())
                .averageRating(averageRating)
                .totalRatings(
                        (long) ratings.size()
                )
                .languages(languageNames)
                .profilePhotoUrl(
                        user.getProfilePhotoUrl()
                )
                .build();
    }
}