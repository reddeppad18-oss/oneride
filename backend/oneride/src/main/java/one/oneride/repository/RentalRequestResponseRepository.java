package one.oneride.repository;

import jakarta.persistence.LockModeType;
import one.oneride.entity.RentalRequest;
import one.oneride.entity.RentalRequestResponse;
import one.oneride.entity.User;
import one.oneride.enums.RentalRequestResponseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface RentalRequestResponseRepository
        extends JpaRepository<RentalRequestResponse, Long> {

    List<RentalRequestResponse> findByRequest(
            RentalRequest request
    );

    List<RentalRequestResponse> findByProvider(
            User provider
    );

    Optional<RentalRequestResponse> findByRequestAndProvider(
            RentalRequest request,
            User provider
    );

    boolean existsByRequestAndProvider(
            RentalRequest request,
            User provider
    );

    List<RentalRequestResponse> findByRequestAndStatus(
            RentalRequest request,
            RentalRequestResponseStatus status
    );

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            SELECT r
            FROM RentalRequestResponse r
            WHERE r.id = :id
            """)
    Optional<RentalRequestResponse> findByIdForUpdate(Long id);
}