package one.oneride.service.impl;

import lombok.RequiredArgsConstructor;
import one.oneride.dto.BookingResponse;
import one.oneride.dto.CreateBookingRequest;
import one.oneride.dto.MessageResponse;
import one.oneride.entity.Booking;
import one.oneride.entity.Ride;
import one.oneride.entity.User;
import one.oneride.enums.BookingStatus;
import one.oneride.enums.RideStatus;
import one.oneride.repository.BookingRepository;
import one.oneride.repository.RideRepository;
import one.oneride.repository.UserRepository;
import one.oneride.service.BookingService;
import org.springframework.stereotype.Service;
import one.oneride.service.NotificationService;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final RideRepository rideRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Override
    public BookingResponse createBooking(
            String phoneNumber,
            CreateBookingRequest request) {

        // Find logged-in user
        User passenger = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // Find ride
        Ride ride = rideRepository.findById(request.getRideId())
                .orElseThrow(() ->
                        new RuntimeException("Ride not found"));

        // Rule 1: User cannot book their own ride
        if (ride.getUser().getId().equals(passenger.getId())) {
            throw new RuntimeException("You cannot book your own ride");
        }

        // Rule 2: Ride must be ACTIVE
        if (ride.getStatus() != RideStatus.ACTIVE) {
            throw new RuntimeException("Ride is not available");
        }

        // Rule 3: Seats requested must be greater than 0
        if (request.getSeatsBooked() <= 0) {
            throw new RuntimeException("Seats booked must be greater than zero");
        }

        // Rule 4: Requested seats should not exceed available seats
        if (request.getSeatsBooked() > ride.getAvailableSeats()) {
            throw new RuntimeException("Not enough seats available");
        }

        // Create booking
        Booking booking = Booking.builder()
                .ride(ride)
                .user(passenger)
                .seatsBooked(request.getSeatsBooked())
                .status(BookingStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        booking = bookingRepository.save(booking);
        notificationService.createNotification(
                ride.getUser(),
                "New Booking Request",
                passenger.getFullName()
                        + " requested "
                        + booking.getSeatsBooked()
                        + " seat(s) for your ride from "
                        + ride.getSource()
                        + " to "
                        + ride.getDestination()
        );

        // Return response
        return BookingResponse.builder()
                .bookingId(booking.getId())
                .rideId(ride.getId())
                .source(ride.getSource())
                .destination(ride.getDestination())
                .seatsBooked(booking.getSeatsBooked())
                .bookingStatus(booking.getStatus().name())
                .build();
    }
    @Override
    public List<BookingResponse> getMyBookings(String phoneNumber) {

        User user = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return bookingRepository.findByUser(user)
                .stream()
                .map(this::mapToBookingResponse)
                .toList();
    }
    private BookingResponse mapToBookingResponse(Booking booking) {

        return BookingResponse.builder()
                .bookingId(booking.getId())
                .rideId(booking.getRide().getId())
                .source(booking.getRide().getSource())
                .destination(booking.getRide().getDestination())
                .seatsBooked(booking.getSeatsBooked())
                .bookingStatus(booking.getStatus().name())
                .build();
    }
    @Override
    public MessageResponse confirmBooking(
            Long bookingId,
            String phoneNumber) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));

        Ride ride = booking.getRide();

        // Only the ride owner can confirm
        if (!ride.getUser().getPhoneNumber().equals(phoneNumber)) {
            throw new RuntimeException("Unauthorized");
        }

        // Booking must be pending
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Booking already processed");
        }

        // Check seat availability
        if (booking.getSeatsBooked() > ride.getAvailableSeats()) {
            throw new RuntimeException("Not enough seats available");
        }

        // Confirm booking
        booking.setStatus(BookingStatus.CONFIRMED);

        // Reduce seats
        ride.setAvailableSeats(
                ride.getAvailableSeats() - booking.getSeatsBooked()
        );

        // Mark ride FULL if no seats remain
        if (ride.getAvailableSeats() == 0) {
            ride.setStatus(RideStatus.FULL);
        }

        bookingRepository.save(booking);
        rideRepository.save(ride);
        notificationService.createNotification(
                booking.getUser(),
                "Booking Confirmed",
                "Your booking for the ride from "
                        + ride.getSource()
                        + " to "
                        + ride.getDestination()
                        + " has been confirmed."
        );

        return MessageResponse.builder()
                .message("Booking confirmed successfully")
                .build();
    }
    @Override
    public MessageResponse rejectBooking(
            Long bookingId,
            String phoneNumber) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));

        Ride ride = booking.getRide();

        // Only the ride owner can reject
        if (!ride.getUser().getPhoneNumber().equals(phoneNumber)) {
            throw new RuntimeException("Unauthorized");
        }

        // Only pending bookings can be rejected
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Booking already processed");
        }

        booking.setStatus(BookingStatus.REJECTED);

        bookingRepository.save(booking);
        notificationService.createNotification(
                booking.getUser(),
                "Booking Rejected",
                "Your booking for the ride from "
                        + ride.getSource()
                        + " to "
                        + ride.getDestination()
                        + " has been rejected."
        );

        return MessageResponse.builder()
                .message("Booking rejected successfully")
                .build();
    }
    @Override
    public List<BookingResponse> getBookingsForRide(
            Long rideId,
            String phoneNumber) {

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() ->
                        new RuntimeException("Ride not found"));

        // Only the ride owner can view bookings
        if (!ride.getUser().getPhoneNumber().equals(phoneNumber)) {
            throw new RuntimeException("Unauthorized");
        }

        return bookingRepository.findByRide(ride)
                .stream()
                .map(this::mapToBookingResponse)
                .toList();
    }
}