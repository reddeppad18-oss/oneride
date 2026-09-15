```java
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

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RatingRepository ratingRepository;
    private final LanguageRepository languageRepository;

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

        // Get ratings received by this user
        List<Rating> ratings =
                ratingRepository.findByReviewee(user);

        double averageRating = ratings.stream()
                .mapToInt(Rating::getRating)
                .average()
                .orElse(0.0);

        long totalRatings = ratings.size();

        // Convert Language entities to language names
        List<String> languages = user.getLanguages()
                .stream()
                .map(Language::getName)
                .collect(Collectors.toList());

        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole().name())
                .verified(user.getVerified())
                .city(user.getCity())
                .aboutMe(user.getAboutMe())
                .averageRating(averageRating)
                .totalRatings(totalRatings)
                .languages(languages)
                .build();
    }

    @Override
    public void updateProfile(
            String phoneNumber,
            UpdateProfileRequest request) {

        User user = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // --------------------------------
        // 1. Update basic profile details
        // --------------------------------

        user.setFullName(request.getFullName());
        user.setCity(request.getCity());
        user.setAboutMe(request.getAboutMe());

        // --------------------------------
        // 2. Update languages
        // --------------------------------

        List<Language> selectedLanguages = new ArrayList<>();

        if (request.getLanguages() != null) {

            for (String languageName : request.getLanguages()) {

                if (languageName == null ||
                        languageName.trim().isEmpty()) {
                    continue;
                }

                String cleanedName = languageName.trim();

                Language language =
                        languageRepository
                                .findByNameIgnoreCase(cleanedName)
                                .orElseThrow(() ->
                                        new RuntimeException(
                                                "Language not found: "
                                                        + cleanedName));

                selectedLanguages.add(language);
            }
        }

        user.setLanguages(selectedLanguages);

        // --------------------------------
        // 3. Save user
        // --------------------------------

        userRepository.save(user);
    }
}
```
