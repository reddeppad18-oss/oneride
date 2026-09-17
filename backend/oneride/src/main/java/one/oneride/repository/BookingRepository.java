package one.oneride.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import one.oneride.entity.Booking;
import one.oneride.entity.Ride;
import one.oneride.entity.User;
import one.oneride.enums.BookingStatus;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUser(User user);

    List<Booking> findByRide(Ride ride);

    List<Booking> findByRideAndStatus(
            Ride ride,
            BookingStatus status
    );

    boolean existsByRideIdAndUserIdAndStatusIn(
            Long rideId,
            Long userId,
            List<BookingStatus> statuses
    );

    List<Booking> findByUserAndStatusIn(
            User user,
            List<BookingStatus> statuses
    );

    List<Booking> findByStatusAndExpiresAtBefore(
            BookingStatus status,
            LocalDateTime expiresAt
    );
}