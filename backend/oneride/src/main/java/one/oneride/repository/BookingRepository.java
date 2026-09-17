package one.oneride.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import one.oneride.entity.Booking;
import one.oneride.entity.Ride;
import one.oneride.entity.User;
import one.oneride.enums.BookingStatus;

public interface BookingRepository
        extends JpaRepository<Booking, Long> {

    /*
     * Get all bookings made by a user.
     */
    List<Booking> findByUser(User user);

    /*
     * Get all bookings for a particular ride.
     */
    List<Booking> findByRide(Ride ride);

    /*
     * Check whether a user already has an active booking
     * for a particular ride.
     */
    boolean existsByRideIdAndUserIdAndStatusIn(
            Long rideId,
            Long userId,
            List<BookingStatus> statuses
    );

    /*
     * Get booking history for a user.
     */
    List<Booking> findByUserAndStatusIn(
            User user,
            List<BookingStatus> statuses
    );
}