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

    @Override
    @Transactional
    public User createUserIfNotExists(
            String phoneNumber) {

        return userRepository
                .findByPhoneNumber(phoneNumber)
                .orElseGet(() -> {

                    User user = User.builder()
                            .phoneNumber(phoneNumber)
                            .verified(true)
                            .notificationsEnabled(true)
                            .bookingNotificationsEnabled(true)
                            .rideNotificationsEnabled(true)
                            .language("English")
                            .build();

                    return userRepository.save(user);
                });
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(
            String phoneNumber) {

        User user = userRepository
                .findByPhoneNumber(phoneNumber)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        return buildUserResponse(user);
    }

    @Override
    @Transactional
    public void updateProfile(
            String phoneNumber,
            UpdateProfileRequest request) {

        User user = userRepository
                .findByPhoneNumber(phoneNumber)
                .orElseThrow(() ->
                        new RuntimeException(
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

    @Override
    @Transactional(readOnly = true)
    public UserResponse getPublicProfile(
            Long userId) {

        User user = userRepository
                .findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        return buildUserResponse(user);
    }

    /*
     * GET SETTINGS
     */
    @Override
    @Transactional(readOnly = true)
    public SettingsResponse getSettings(
            String phoneNumber) {

        User user = userRepository
                .findByPhoneNumber(phoneNumber)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        /*
         * Defaults are applied for existing users
         * whose settings columns may contain NULL.
         */

        Boolean notificationsEnabled =
                user.getNotificationsEnabled() != null
                        ? user.getNotificationsEnabled()
                        : true;

        Boolean bookingNotificationsEnabled =
                user.getBookingNotificationsEnabled() != null
                        ? user.getBookingNotificationsEnabled()
                        : true;

        Boolean rideNotificationsEnabled =
                user.getRideNotificationsEnabled() != null
                        ? user.getRideNotificationsEnabled()
                        : true;

        String language =
                user.getLanguage() != null
                        && !user.getLanguage().isBlank()
                        ? user.getLanguage()
                        : "English";

        return new SettingsResponse(
                notificationsEnabled,
                bookingNotificationsEnabled,
                rideNotificationsEnabled,
                language
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
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        /*
         * Master notification setting
         */
        if (request.getNotificationsEnabled() != null) {

            user.setNotificationsEnabled(
                    request.getNotificationsEnabled()
            );
        }

        /*
         * Booking notifications
         */
        if (request.getBookingNotificationsEnabled() != null) {

            user.setBookingNotificationsEnabled(
                    request.getBookingNotificationsEnabled()
            );
        }

        /*
         * Ride notifications
         */
        if (request.getRideNotificationsEnabled() != null) {

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

        userRepository.save(user);
    }

    /*
     * BUILD USER RESPONSE
     */
    private UserResponse buildUserResponse(
            User user) {

        /*
         * Get ratings received by this user.
         */
        List<?> ratings =
                ratingRepository.findByReviewee(user);

        /*
         * Calculate average rating.
         */
        double averageRating = ratings
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

        /*
         * Convert List<Language>
         * into List<String>.
         */
        List<String> languageNames =
                user.getLanguages()
                        .stream()
                        .map(Language::getName)
                        .toList();

        return UserResponse.builder()

                .id(
                        user.getId()
                )

                .fullName(
                        user.getFullName()
                )

                .phoneNumber(
                        user.getPhoneNumber()
                )

                .role(
                        user.getRole() != null
                                ? user.getRole().name()
                                : null
                )

                .verified(
                        user.getVerified()
                )

                .city(
                        user.getCity()
                )

                .aboutMe(
                        user.getAboutMe()
                )

                .averageRating(
                        averageRating
                )

                .totalRatings(
                        (long) ratings.size()
                )

                .languages(
                        languageNames
                )

                .profilePhotoUrl(
                        user.getProfilePhotoUrl()
                )

                .build();
    }
}