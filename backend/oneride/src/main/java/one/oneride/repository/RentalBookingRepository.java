package one.oneride.repository;

import one.oneride.entity.RentalBooking;
import one.oneride.entity.RentalListing;
import one.oneride.entity.User;
import one.oneride.enums.RentalBookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RentalBookingRepository
        extends JpaRepository<RentalBooking, Long> {


    // Customer's bookings
    List<RentalBooking> findByCustomer(User customer);


    // Bookings for a specific rental vehicle
    List<RentalBooking> findByRentalListing(
            RentalListing rentalListing
    );


    // Find bookings by status
    List<RentalBooking> findByRentalListingAndStatus(
            RentalListing rentalListing,
            RentalBookingStatus status
    );


    // Prevent duplicate active bookings
    boolean existsByRentalListingIdAndCustomerIdAndStatusIn(
            Long rentalId,
            Long customerId,
            List<RentalBookingStatus> statuses
    );
}