package one.oneride.service.impl;

import lombok.RequiredArgsConstructor;
import one.oneride.dto.UpdateProfileRequest;
import one.oneride.dto.UserResponse;
import one.oneride.entity.Language;
import one.oneride.entity.User;
import one.oneride.repository.RatingRepository;
import one.oneride.repository.UserRepository;
import one.oneride.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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

        /*
         * Languages are not updated here because
         * User.languages is List<Language>, while
         * UpdateProfileRequest.languages is List<String>.
         *
         * We can add language management separately
         * using Language entities.
         */

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
         * Convert:
         *
         * List<Language>
         *
         * into:
         *
         * List<String>
         *
         * because UserResponse expects
         * List<String> languages.
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
