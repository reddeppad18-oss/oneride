package one.oneride.repository;

import jakarta.persistence.LockModeType;
import one.oneride.entity.RideRequest;
import one.oneride.entity.User;
import one.oneride.enums.RideRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface RideRequestRepository
        extends JpaRepository<RideRequest, Long> {

    List<RideRequest> findByCustomerOrderByCreatedAtDesc(
            User customer
    );

    List<RideRequest> findByStatus(
            RideRequestStatus status
    );

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            SELECT r
            FROM RideRequest r
            WHERE r.id = :id
            """)
    Optional<RideRequest> findByIdForUpdate(Long id);
}