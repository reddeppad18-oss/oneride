```java
package one.oneride.config;

import java.util.List;

import lombok.RequiredArgsConstructor;
import one.oneride.entity.Language;
import one.oneride.repository.LanguageRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final LanguageRepository languageRepository;

    @Override
    public void run(String... args) {

        List<String> languages = List.of(
                "English",
                "Hindi",
                "Telugu",
                "Tamil",
                "Kannada",
                "Malayalam",
                "Marathi",
                "Bengali",
                "Gujarati",
                "Punjabi",
                "Odia",
                "Urdu"
        );

        for (String languageName : languages) {

            if (languageRepository
                    .findByNameIgnoreCase(languageName)
                    .isEmpty()) {

                Language language = Language.builder()
                        .name(languageName)
                        .build();

                languageRepository.save(language);

                System.out.println(
                        "Language added: " + languageName
                );
            }
        }

        System.out.println(
                "===================================="
        );
        System.out.println(
                "Language initialization completed"
        );
        System.out.println(
                "===================================="
        );
    }
}
```
