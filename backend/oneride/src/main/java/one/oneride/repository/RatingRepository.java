package one.oneride.repository;

import one.oneride.entity.Booking;
import one.oneride.entity.Rating;
import one.oneride.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    List<Rating> findByReviewee(User reviewee);

    Optional<Rating> findByBookingAndReviewer(
            Booking booking,
            User reviewer
    );
}