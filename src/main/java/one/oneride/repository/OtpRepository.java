package one.oneride.repository;


import one.oneride.entity.OtpDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OtpRepository
        extends JpaRepository<OtpDetails, Long> {

    Optional<OtpDetails>
    findTopByPhoneNumberOrderByIdDesc(
            String phoneNumber);
}