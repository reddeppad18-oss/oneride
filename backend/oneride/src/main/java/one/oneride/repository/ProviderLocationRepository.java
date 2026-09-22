package one.oneride.repository;

import one.oneride.entity.ProviderLocation;
import one.oneride.entity.User;
import one.oneride.enums.ProviderAvailability;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProviderLocationRepository
        extends JpaRepository<ProviderLocation, Long> {

    Optional<ProviderLocation> findByUser(User user);

    Optional<ProviderLocation> findByUserId(Long userId);

    List<ProviderLocation> findByAvailability(
            ProviderAvailability availability
    );

    List<ProviderLocation> findByAvailabilityAndProviderType(
            ProviderAvailability availability,
            one.oneride.enums.ProviderType providerType
    );
}