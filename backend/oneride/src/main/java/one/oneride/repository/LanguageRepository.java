package one.oneride.repository;

import java.util.Optional;

import one.oneride.entity.Language;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LanguageRepository
        extends JpaRepository<Language, Long> {

    Optional<Language> findByNameIgnoreCase(String name);
}

