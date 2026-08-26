package one.oneride.repository;

import one.oneride.entity.RentalListing;
import one.oneride.entity.User;
import one.oneride.enums.RentalStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RentalRepository
        extends JpaRepository<RentalListing, Long> {


    // Get all vehicles listed by a user
    List<RentalListing> findByOwner(User owner);


    // Search available rental vehicles
    List<RentalListing> findByStatus(RentalStatus status);


    // Search by location
    List<RentalListing> findByLocationIgnoreCaseAndStatus(
            String location,
            RentalStatus status
    );
}