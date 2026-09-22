package one.oneride.repository;

import jakarta.persistence.LockModeType;
import one.oneride.entity.RideRequest;
import one.oneride.entity.RideRequestResponse;
import one.oneride.entity.User;
import one.oneride.enums.RideRequestResponseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface RideRequestResponseRepository
        extends JpaRepository<RideRequestResponse, Long> {

    List<RideRequestResponse> findByRequest(
            RideRequest request
    );

    List<RideRequestResponse> findByProvider(
            User provider
    );

    Optional<RideRequestResponse> findByRequestAndProvider(
            RideRequest request,
            User provider
    );

    boolean existsByRequestAndProvider(
            RideRequest request,
            User provider
    );

    List<RideRequestResponse> findByRequestAndStatus(
            RideRequest request,
            RideRequestResponseStatus status
    );

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            SELECT r
            FROM RideRequestResponse r
            WHERE r.id = :id
            """)
    Optional<RideRequestResponse> findByIdForUpdate(Long id);
}