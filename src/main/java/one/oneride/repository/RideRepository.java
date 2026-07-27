package one.oneride.repository;

import jakarta.persistence.LockModeType;
import one.oneride.entity.Ride;
import one.oneride.entity.User;
import one.oneride.enums.RideStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface RideRepository
        extends JpaRepository<Ride, Long>,
        JpaSpecificationExecutor<Ride> {

    List<Ride> findByUser(User user);

    List<Ride> findByUserAndStatusIn(
            User user,
            List<RideStatus> statuses
    );
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT r FROM Ride r WHERE r.id = :id")
    Optional<Ride> findByIdForUpdate(Long id);
}