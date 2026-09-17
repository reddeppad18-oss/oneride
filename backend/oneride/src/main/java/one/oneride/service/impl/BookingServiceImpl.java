package one.oneride.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

import one.oneride.dto.BookingResponse;
import one.oneride.dto.CreateBookingRequest;
import one.oneride.dto.MessageResponse;

import one.oneride.entity.Booking;
import one.oneride.entity.Ride;
import one.oneride.entity.User;

import one.oneride.enums.BookingStatus;
import one.oneride.enums.NotificationType;
import one.oneride.enums.RideStatus;

import one.oneride.repository.BookingRepository;
import one.oneride.repository.RideRepository;
import one.oneride.repository.UserRepository;

import one.oneride.service.BookingService;
import one.oneride.service.NotificationService;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;

    private final RideRepository rideRepository;

    private final UserRepository userRepository;

    private final NotificationService notificationService;


    // =========================================================
    // CREATE BOOKING
    // =========================================================

    @Override
    @Transactional
    public BookingResponse createBooking(
            String phoneNumber,
            CreateBookingRequest request) {

        User passenger =
                userRepository.findByPhoneNumber(phoneNumber)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        Ride ride =
                rideRepository.findById(request.getRideId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Ride not found"
                                )
                        );


        // -----------------------------------------------------
        // Check existing active booking
        // -----------------------------------------------------

        List<BookingStatus> activeStatuses = List.of(
                BookingStatus.PENDING,
                BookingStatus.CONFIRMED
        );


        boolean alreadyBooked =
                bookingRepository
                        .existsByRideIdAndUserIdAndStatusIn(
                                ride.getId(),
                                passenger.getId(),
                                activeStatuses
                        );


        if (alreadyBooked) {

            throw new RuntimeException(
                    "You already have a booking request for this ride"
            );
        }


        // -----------------------------------------------------
        // Passenger cannot book own ride
        // -----------------------------------------------------

        if (ride.getUser()
                .getId()
                .equals(passenger.getId())) {

            throw new RuntimeException(
                    "You cannot book your own ride"
            );
        }


        // -----------------------------------------------------
        // Ride must be active
        // -----------------------------------------------------

        if (ride.getStatus() != RideStatus.ACTIVE) {

            throw new RuntimeException(
                    "Ride is not available"
            );
        }


        // -----------------------------------------------------
        // Validate seats
        // -----------------------------------------------------

        if (request.getSeatsBooked() == null
                || request.getSeatsBooked() <= 0) {

            throw new RuntimeException(
                    "Seats booked must be greater than zero"
            );
        }


        // -----------------------------------------------------
        // Check available seats
        // -----------------------------------------------------

        if (request.getSeatsBooked()
                > ride.getAvailableSeats()) {

            throw new RuntimeException(
                    "Not enough seats available"
            );
        }


        // -----------------------------------------------------
        // Create booking
        // -----------------------------------------------------

        Booking booking = Booking.builder()
                .ride(ride)
                .user(passenger)
                .seatsBooked(
                        request.getSeatsBooked()
                )
                .status(
                        BookingStatus.PENDING
                )
                .createdAt(
                        LocalDateTime.now()
                )
                .expiresAt(
                        LocalDateTime.of(
                                ride.getTravelDate(),
                                ride.getTravelTime()
                        )
                )
                .build();


        booking = bookingRepository.save(booking);


        // -----------------------------------------------------
        // Notify ride owner
        // -----------------------------------------------------

        notificationService.createNotification(
                ride.getUser(),
                "New Booking Request",
                passenger.getFullName()
                        + " requested "
                        + booking.getSeatsBooked()
                        + " seat(s) for your ride from "
                        + ride.getSource()
                        + " to "
                        + ride.getDestination(),
                NotificationType.BOOKING_REQUEST
        );


        return mapToBookingResponse(booking);
    }


    // =========================================================
    // GET MY BOOKINGS
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getMyBookings(
            String phoneNumber) {

        User user =
                userRepository.findByPhoneNumber(phoneNumber)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        return bookingRepository
                .findByUser(user)
                .stream()
                .map(this::mapToBookingResponse)
                .toList();
    }


    // =========================================================
    // CONFIRM BOOKING
    // =========================================================

    @Override
    @Transactional
    public MessageResponse confirmBooking(
            Long bookingId,
            String phoneNumber) {

        Booking booking =
                bookingRepository.findById(bookingId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Booking not found"
                                )
                        );


        Ride ride =
                rideRepository.findByIdForUpdate(
                        booking.getRide().getId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Ride not found"
                        )
                );


        // -----------------------------------------------------
        // Verify ride owner
        // -----------------------------------------------------

        if (!ride.getUser()
                .getPhoneNumber()
                .equals(phoneNumber)) {

            throw new RuntimeException(
                    "Unauthorized"
            );
        }


        // -----------------------------------------------------
        // Only pending bookings
        // -----------------------------------------------------

        if (booking.getStatus()
                != BookingStatus.PENDING) {

            throw new RuntimeException(
                    "Booking already processed"
            );
        }


        // -----------------------------------------------------
        // Check available seats
        // -----------------------------------------------------

        if (booking.getSeatsBooked()
                > ride.getAvailableSeats()) {

            throw new RuntimeException(
                    "Not enough seats available"
            );
        }


        // -----------------------------------------------------
        // Confirm booking
        // -----------------------------------------------------

        booking.setStatus(
                BookingStatus.CONFIRMED
        );


        // -----------------------------------------------------
        // Reduce seats
        // -----------------------------------------------------

        ride.setAvailableSeats(
                ride.getAvailableSeats()
                        - booking.getSeatsBooked()
        );


        // -----------------------------------------------------
        // Mark ride FULL if no seats remain
        // -----------------------------------------------------

        if (ride.getAvailableSeats() == 0) {

            ride.setStatus(
                    RideStatus.FULL
            );
        }


        bookingRepository.save(booking);

        rideRepository.save(ride);


        // -----------------------------------------------------
        // Notify passenger
        // -----------------------------------------------------

        notificationService.createNotification(
                booking.getUser(),
                "Booking Confirmed",
                "Your booking for the ride from "
                        + ride.getSource()
                        + " to "
                        + ride.getDestination()
                        + " has been confirmed.",
                NotificationType.BOOKING_CONFIRMED
        );


        return MessageResponse.builder()
                .message(
                        "Booking confirmed successfully"
                )
                .build();
    }


    // =========================================================
    // REJECT BOOKING
    // =========================================================

    @Override
    @Transactional
    public MessageResponse rejectBooking(
            Long bookingId,
            String phoneNumber) {

        Booking booking =
                bookingRepository.findById(bookingId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Booking not found"
                                )
                        );


        Ride ride = booking.getRide();


        // -----------------------------------------------------
        // Verify ride owner
        // -----------------------------------------------------

        if (!ride.getUser()
                .getPhoneNumber()
                .equals(phoneNumber)) {

            throw new RuntimeException(
                    "Unauthorized"
            );
        }


        // -----------------------------------------------------
        // Only pending bookings
        // -----------------------------------------------------

        if (booking.getStatus()
                != BookingStatus.PENDING) {

            throw new RuntimeException(
                    "Booking already processed"
            );
        }


        // -----------------------------------------------------
        // Reject booking
        // -----------------------------------------------------

        booking.setStatus(
                BookingStatus.REJECTED
        );


        bookingRepository.save(booking);


        // -----------------------------------------------------
        // Notify passenger
        // -----------------------------------------------------

        notificationService.createNotification(
                booking.getUser(),
                "Booking Rejected",
                "Your booking for the ride from "
                        + ride.getSource()
                        + " to "
                        + ride.getDestination()
                        + " has been rejected.",
                NotificationType.BOOKING_REJECTED
        );


        return MessageResponse.builder()
                .message(
                        "Booking rejected successfully"
                )
                .build();
    }


    // =========================================================
    // GET BOOKINGS FOR RIDE
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getBookingsForRide(
            Long rideId,
            String phoneNumber) {

        Ride ride =
                rideRepository.findById(rideId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Ride not found"
                                )
                        );


        // -----------------------------------------------------
        // Only ride owner can view bookings
        // -----------------------------------------------------

        if (!ride.getUser()
                .getPhoneNumber()
                .equals(phoneNumber)) {

            throw new RuntimeException(
                    "Unauthorized"
            );
        }


        return bookingRepository
                .findByRide(ride)
                .stream()
                .map(this::mapToBookingResponse)
                .toList();
    }


    // =========================================================
    // GET BOOKING HISTORY
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getBookingHistory(
            String phoneNumber) {

        User user =
                userRepository.findByPhoneNumber(phoneNumber)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        List<BookingStatus> historyStatuses = List.of(
                BookingStatus.COMPLETED,
                BookingStatus.CANCELLED,
                BookingStatus.REJECTED,
                BookingStatus.EXPIRED
        );


        return bookingRepository
                .findByUserAndStatusIn(
                        user,
                        historyStatuses
                )
                .stream()
                .map(this::mapToBookingResponse)
                .toList();
    }


    // =========================================================
    // CANCEL BOOKING
    // =========================================================

    @Override
    @Transactional
    public MessageResponse cancelBooking(
            Long bookingId,
            String phoneNumber) {

        Booking booking =
                bookingRepository.findById(bookingId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Booking not found"
                                )
                        );


        // -----------------------------------------------------
        // Verify booking owner
        // -----------------------------------------------------

        if (!booking.getUser()
                .getPhoneNumber()
                .equals(phoneNumber)) {

            throw new RuntimeException(
                    "You can cancel only your own booking"
            );
        }


        // -----------------------------------------------------
        // Check booking status
        // -----------------------------------------------------

        if (booking.getStatus()
                != BookingStatus.PENDING
                && booking.getStatus()
                != BookingStatus.CONFIRMED) {

            throw new RuntimeException(
                    "Only pending or confirmed bookings can be cancelled"
            );
        }


        // -----------------------------------------------------
        // Lock ride
        // -----------------------------------------------------

        Ride ride =
                rideRepository.findByIdForUpdate(
                        booking.getRide().getId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Ride not found"
                        )
                );


        // -----------------------------------------------------
        // Remember previous status
        // -----------------------------------------------------

        boolean wasConfirmed =
                booking.getStatus()
                        == BookingStatus.CONFIRMED;


        // -----------------------------------------------------
        // Cancel booking
        // -----------------------------------------------------

        booking.setStatus(
                BookingStatus.CANCELLED
        );


        // -----------------------------------------------------
        // Return seats
        // -----------------------------------------------------

        if (wasConfirmed) {

            ride.setAvailableSeats(
                    ride.getAvailableSeats()
                            + booking.getSeatsBooked()
            );


            // -------------------------------------------------
            // If ride was FULL, make it ACTIVE again
            // -------------------------------------------------

            if (ride.getStatus() == RideStatus.FULL
                    && ride.getAvailableSeats() > 0) {

                ride.setStatus(
                        RideStatus.ACTIVE
                );
            }
        }


        // -----------------------------------------------------
        // Save
        // -----------------------------------------------------

        bookingRepository.save(booking);

        rideRepository.save(ride);


        // -----------------------------------------------------
        // Notify ride owner
        // -----------------------------------------------------

        notificationService.createNotification(
                ride.getUser(),
                "Booking Cancelled",
                "A passenger cancelled the booking for your ride from "
                        + ride.getSource()
                        + " to "
                        + ride.getDestination(),
                NotificationType.BOOKING_CANCELLED
        );


        return MessageResponse.builder()
                .message(
                        "Booking cancelled successfully"
                )
                .build();
    }


    // =========================================================
    // MAP BOOKING → RESPONSE
    // =========================================================

    private BookingResponse mapToBookingResponse(
            Booking booking) {

        Ride ride = booking.getRide();

        User rideOwner = ride.getUser();

        User passenger = booking.getUser();


        return BookingResponse.builder()

                .bookingId(
                        booking.getId()
                )

                .rideId(
                        ride.getId()
                )

                .source(
                        ride.getSource()
                )

                .destination(
                        ride.getDestination()
                )

                .rideOwnerName(
                        rideOwner.getFullName()
                )

                .passengerName(
                        passenger.getFullName()
                )

                .travelDate(
                        ride.getTravelDate().toString()
                )

                .travelTime(
                        ride.getTravelTime().toString()
                )

                .seatsBooked(
                        booking.getSeatsBooked()
                )

                .pricePerSeat(
                        ride.getPricePerSeat()
                )

                .totalAmount(
                        ride.getPricePerSeat()
                                * booking.getSeatsBooked()
                )

                .bookingStatus(
                        booking.getStatus().name()
                )

                // -------------------------------------------------
                // Vehicle details
                // -------------------------------------------------

                .vehicleType(
                        ride.getVehicleType()
                )

                .brand(
                        ride.getVehicleName()
                )

                .registrationNumber(
                        ride.getVehicleNumber()
                )

                .build();
    }
}