package one.oneride.repository;

import one.oneride.entity.Booking;
import one.oneride.entity.Ride;
import one.oneride.entity.User;
import one.oneride.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository
        extends JpaRepository<Booking, Long> {

    List<Booking> findByUser(User user);

    List<Booking> findByRide(Ride ride);

    List<Booking> findByRideAndStatus(
            Ride ride,
            BookingStatus status
    );
}