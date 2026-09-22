package one.oneride.repository;

import jakarta.persistence.LockModeType;
import one.oneride.entity.RentalRequest;
import one.oneride.entity.User;
import one.oneride.enums.RentalRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface RentalRequestRepository
        extends JpaRepository<RentalRequest, Long> {

    List<RentalRequest> findByCustomerOrderByCreatedAtDesc(
            User customer
    );

    List<RentalRequest> findByStatus(
            RentalRequestStatus status
    );

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            SELECT r
            FROM RentalRequest r
            WHERE r.id = :id
            """)
    Optional<RentalRequest> findByIdForUpdate(Long id);
}