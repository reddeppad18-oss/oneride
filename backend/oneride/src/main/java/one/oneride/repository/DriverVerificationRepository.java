package one.oneride.repository;

import one.oneride.entity.DriverVerification;
import one.oneride.entity.User;
import one.oneride.enums.DriverVerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DriverVerificationRepository
        extends JpaRepository<DriverVerification, Long> {

    Optional<DriverVerification> findByUser(User user);

    Optional<DriverVerification> findByUserId(Long userId);

    boolean existsByUserAndStatus(
            User user,
            DriverVerificationStatus status
    );
}