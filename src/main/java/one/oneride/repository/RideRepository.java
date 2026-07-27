package one.oneride.repository;

import one.oneride.entity.Ride;
import one.oneride.entity.User;
import one.oneride.enums.RideStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RideRepository extends JpaRepository<Ride, Long> {
    List<Ride> findByUser(User user);
    List<Ride> findBySourceIgnoreCaseAndDestinationIgnoreCaseAndTravelDateAndStatus(
            String source,
            String destination,
            LocalDate travelDate,
            RideStatus status
    );
    List<Ride> findByUserAndStatusIn(
            User user,
            List<RideStatus> statuses
    );
}