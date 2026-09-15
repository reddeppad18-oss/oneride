package one.oneride.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import one.oneride.dto.UpdateProfileRequest;
import one.oneride.dto.UserResponse;
import one.oneride.entity.Language;
import one.oneride.entity.Rating;
import one.oneride.entity.User;
import one.oneride.enums.UserRole;
import one.oneride.repository.LanguageRepository;
import one.oneride.repository.RatingRepository;
import one.oneride.repository.UserRepository;
import one.oneride.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final RatingRepository ratingRepository;

    private final LanguageRepository languageRepository;

    @Override
    @Transactional
    public User createUserIfNotExists(
            String phoneNumber
    ) {

        return userRepository
                .findByPhoneNumber(phoneNumber)
                .orElseGet(() -> {

                    User user = User.builder()
                            .phoneNumber(phoneNumber)
                            .role(UserRole.RIDER)
                            .verified(true)
                            .createdAt(
                                    LocalDateTime.now()
                            )
                            .build();

                    return userRepository.save(user);
                });
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(
            String phoneNumber
    ) {

        User user = userRepository
                .findByPhoneNumber(phoneNumber)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        List<Rating> ratings =
                ratingRepository.findByReviewee(user);

        double averageRating =
                ratings.stream()
                        .mapToInt(Rating::getRating)
                        .average()
                        .orElse(0.0);

        long totalRatings =
                ratings.size();

        List<String> languages =
                user.getLanguages()
                        .stream()
                        .map(Language::getName)
                        .collect(Collectors.toList());

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
                .totalRatings(totalRatings)
                .languages(languages)
                .profilePhotoUrl(
                        user.getProfilePhotoUrl()
                )
                .build();
    }

    @Override
    @Transactional
    public void updateProfile(
            String phoneNumber,
            UpdateProfileRequest request
    ) {

        User user = userRepository
                .findByPhoneNumber(phoneNumber)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        if (request.getFullName() == null ||
                request.getFullName()
                        .trim()
                        .isEmpty()) {

            throw new RuntimeException(
                    "Name is required"
            );
        }

        user.setFullName(
                request.getFullName().trim()
        );

        if (request.getCity() != null) {

            user.setCity(
                    request.getCity().trim()
            );

        } else {

            user.setCity(null);
        }

        if (request.getAboutMe() != null) {

            user.setAboutMe(
                    request.getAboutMe().trim()
            );

        } else {

            user.setAboutMe(null);
        }

        List<Language> selectedLanguages =
                new ArrayList<>();

        if (request.getLanguages() != null) {

            for (String languageName :
                    request.getLanguages()) {

                if (languageName == null ||
                        languageName
                                .trim()
                                .isEmpty()) {

                    continue;
                }

                String cleanedName =
                        languageName.trim();

                Language language =
                        languageRepository
                                .findByNameIgnoreCase(
                                        cleanedName
                                )
                                .orElseThrow(() ->
                                        new RuntimeException(
                                                "Language not found: "
                                                        + cleanedName
                                        )
                                );

                selectedLanguages.add(language);
            }
        }

        user.setLanguages(
                selectedLanguages
        );

        userRepository.save(user);
    }
}
