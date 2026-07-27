package one.oneride.service.impl;

import lombok.RequiredArgsConstructor;
import one.oneride.dto.CreateRatingRequest;
import one.oneride.dto.RatingResponse;
import one.oneride.entity.Booking;
import one.oneride.entity.Rating;
import one.oneride.entity.User;
import one.oneride.enums.RideStatus;
import one.oneride.repository.BookingRepository;
import one.oneride.repository.RatingRepository;
import one.oneride.repository.UserRepository;
import one.oneride.service.RatingService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class RatingServiceImpl implements RatingService {

    private final RatingRepository ratingRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    @Override
    public RatingResponse createRating(
            String phoneNumber,
            CreateRatingRequest request) {

        User reviewer = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));

        // Ride must be completed
        if (booking.getRide().getStatus() != RideStatus.COMPLETED) {
            throw new RuntimeException("Ride is not completed");
        }

        User driver = booking.getRide().getUser();
        User passenger = booking.getUser();

        User reviewee;

        if (reviewer.getId().equals(driver.getId())) {
            reviewee = passenger;
        } else if (reviewer.getId().equals(passenger.getId())) {
            reviewee = driver;
        } else {
            throw new RuntimeException("Unauthorized");
        }

        // Prevent duplicate rating
        ratingRepository.findByBookingAndReviewer(
                booking,
                reviewer
        ).ifPresent(r ->
        {
            throw new RuntimeException("You have already rated this booking");
        });

        Rating rating = Rating.builder()
                .booking(booking)
                .reviewer(reviewer)
                .reviewee(reviewee)
                .rating(request.getRating())
                .review(request.getReview())
                .createdAt(LocalDateTime.now())
                .build();

        rating = ratingRepository.save(rating);

        return RatingResponse.builder()
                .id(rating.getId())
                .rating(rating.getRating())
                .review(rating.getReview())
                .reviewerName(reviewer.getFullName())
                .revieweeName(reviewee.getFullName())
                .build();
    }
}