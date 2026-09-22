package one.oneride.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import one.oneride.dto.AvailabilityRequest;
import one.oneride.dto.UpdateProviderLocationRequest;
import one.oneride.entity.ProviderLocation;
import one.oneride.entity.User;
import one.oneride.enums.ProviderAvailability;
import one.oneride.repository.ProviderLocationRepository;
import one.oneride.repository.UserRepository;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ProviderLocationService {

    private final ProviderLocationRepository providerLocationRepository;
    private final UserRepository userRepository;

    @Transactional
    public ProviderLocation updateLocation(
            String phoneNumber,
            UpdateProviderLocationRequest request) {

        User user = getUser(phoneNumber);

        ProviderLocation location =
                providerLocationRepository
                        .findByUser(user)
                        .orElseGet(() ->
                                ProviderLocation.builder()
                                        .user(user)
                                        .build()
                        );

        location.setLatitude(request.getLatitude());
        location.setLongitude(request.getLongitude());
        location.setProviderType(request.getProviderType());
        location.setLastUpdatedAt(LocalDateTime.now());

        if (location.getAvailability() == null) {
            location.setAvailability(
                    ProviderAvailability.OFFLINE
            );
        }

        return providerLocationRepository.save(location);
    }

    @Transactional
    public ProviderLocation updateAvailability(
            String phoneNumber,
            AvailabilityRequest request) {

        User user = getUser(phoneNumber);

        ProviderLocation location =
                providerLocationRepository
                        .findByUser(user)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Provider location not found. Update location first."
                                )
                        );

        location.setAvailability(
                Boolean.TRUE.equals(request.getAvailable())
                        ? ProviderAvailability.AVAILABLE
                        : ProviderAvailability.OFFLINE
        );

        location.setLastUpdatedAt(
                LocalDateTime.now()
        );

        return providerLocationRepository.save(location);
    }

    @Transactional(readOnly = true)
    public ProviderLocation getMyLocation(
            String phoneNumber) {

        User user = getUser(phoneNumber);

        return providerLocationRepository
                .findByUser(user)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Provider location not found"
                        )
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