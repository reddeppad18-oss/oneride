package one.oneride.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import one.oneride.dto.DriverVerificationRequest;
import one.oneride.entity.DriverVerification;
import one.oneride.entity.User;
import one.oneride.enums.DriverVerificationStatus;
import one.oneride.repository.DriverVerificationRepository;
import one.oneride.repository.UserRepository;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DriverVerificationService {

    private final DriverVerificationRepository
            driverVerificationRepository;

    private final UserRepository userRepository;

    @Transactional
    public DriverVerification submit(
            String phoneNumber,
            DriverVerificationRequest request) {

        User user = getUser(phoneNumber);

        DriverVerification verification =
                driverVerificationRepository
                        .findByUser(user)
                        .orElseGet(() ->
                                DriverVerification.builder()
                                        .user(user)
                                        .build()
                        );

        verification.setVerificationReference(
                request.getVerificationReference()
        );

        verification.setStatus(
                DriverVerificationStatus.PENDING
        );

        verification.setSubmittedAt(
                LocalDateTime.now()
        );

        verification.setVerifiedAt(null);
        verification.setRejectionReason(null);

        return driverVerificationRepository.save(
                verification
        );
    }

    @Transactional(readOnly = true)
    public DriverVerification getMyVerification(
            String phoneNumber) {

        User user = getUser(phoneNumber);

        return driverVerificationRepository
                .findByUser(user)
                .orElseGet(() ->
                        DriverVerification.builder()
                                .user(user)
                                .status(
                                        DriverVerificationStatus
                                                .NOT_SUBMITTED
                                )
                                .build()
                );
    }

    private User getUser(String phoneNumber) {

        return userRepository
                .findByPhoneNumber(phoneNumber)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );
    }
}