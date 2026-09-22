package one.oneride.repository;

import one.oneride.entity.RentalListing;
import one.oneride.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RentalListingRepository
        extends JpaRepository<RentalListing, Long> {

    List<RentalListing> findByOwner(User owner);
}