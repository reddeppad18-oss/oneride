package one.oneride.controller;

import java.util.List;

import lombok.RequiredArgsConstructor;
import one.oneride.entity.Language;
import one.oneride.repository.LanguageRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/languages")
@RequiredArgsConstructor
@CrossOrigin("*")
public class LanguageController {

    private final LanguageRepository languageRepository;

    @GetMapping
    public List<Language> getAllLanguages() {
        return languageRepository.findAll();
    }
}
