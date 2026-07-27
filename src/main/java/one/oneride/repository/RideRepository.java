package one.oneride.repository;

import one.oneride.entity.Ride;
import one.oneride.entity.User;
import one.oneride.enums.RideStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface RideRepository
        extends JpaRepository<Ride, Long>,
        JpaSpecificationExecutor<Ride> {

    List<Ride> findByUser(User user);

    List<Ride> findByUserAndStatusIn(
            User user,
            List<RideStatus> statuses
    );
}