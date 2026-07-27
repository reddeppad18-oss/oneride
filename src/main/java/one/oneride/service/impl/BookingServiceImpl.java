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
import one.oneride.service.NotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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


        User passenger = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));


        Ride ride = rideRepository.findById(request.getRideId())
                .orElseThrow(() ->
                        new RuntimeException("Ride not found"));


        List<BookingStatus> activeStatuses = List.of(
                BookingStatus.PENDING,
                BookingStatus.CONFIRMED
        );


        boolean alreadyBooked =
                bookingRepository.existsByRideIdAndUserIdAndStatusIn(
                        ride.getId(),
                        passenger.getId(),
                        activeStatuses
                );


        if (alreadyBooked) {
            throw new RuntimeException(
                    "You already have a booking request for this ride"
            );
        }


        if (ride.getUser().getId().equals(passenger.getId())) {
            throw new RuntimeException(
                    "You cannot book your own ride"
            );
        }


        if (ride.getStatus() != RideStatus.ACTIVE) {
            throw new RuntimeException(
                    "Ride is not available"
            );
        }


        if (request.getSeatsBooked() <= 0) {
            throw new RuntimeException(
                    "Seats booked must be greater than zero"
            );
        }


        if (request.getSeatsBooked() > ride.getAvailableSeats()) {
            throw new RuntimeException(
                    "Not enough seats available"
            );
        }
        Booking booking = Booking.builder()
                .ride(ride)
                .user(passenger)
                .seatsBooked(request.getSeatsBooked())
                .status(BookingStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .expiresAt(
                        LocalDateTime.of(
                                ride.getTravelDate(),
                                ride.getTravelTime()
                        )
                )
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


        return mapToBookingResponse(booking);
    }


    @Override
    public List<BookingResponse> getMyBookings(
            String phoneNumber) {


        User user = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));


        return bookingRepository.findByUser(user)
                .stream()
                .map(this::mapToBookingResponse)
                .toList();
    }


    private BookingResponse mapToBookingResponse(
            Booking booking) {


        Ride ride = booking.getRide();

        User rideOwner = ride.getUser();

        User passenger = booking.getUser();


        return BookingResponse.builder()

                .bookingId(booking.getId())

                .rideId(ride.getId())

                .source(ride.getSource())

                .destination(ride.getDestination())

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

                .build();
    }


    @Override
    @Transactional
    public MessageResponse confirmBooking(
            Long bookingId,
            String phoneNumber) {


        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));


        Ride ride = rideRepository.findByIdForUpdate(
                        booking.getRide().getId()
                )
                .orElseThrow(() ->
                        new RuntimeException("Ride not found"));


        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException(
                    "Booking already processed"
            );
        }


        if (booking.getSeatsBooked() > ride.getAvailableSeats()) {
            throw new RuntimeException(
                    "Not enough seats available"
            );
        }


        booking.setStatus(
                BookingStatus.CONFIRMED
        );


        ride.setAvailableSeats(
                ride.getAvailableSeats()
                        - booking.getSeatsBooked()
        );


        if (ride.getAvailableSeats() == 0) {
            ride.setStatus(
                    RideStatus.FULL
            );
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


        if (!ride.getUser()
                .getPhoneNumber()
                .equals(phoneNumber)) {

            throw new RuntimeException(
                    "Unauthorized"
            );
        }


        if (booking.getStatus() != BookingStatus.PENDING) {

            throw new RuntimeException(
                    "Booking already processed"
            );
        }


        booking.setStatus(
                BookingStatus.REJECTED
        );


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


        if (!ride.getUser()
                .getPhoneNumber()
                .equals(phoneNumber)) {

            throw new RuntimeException(
                    "Unauthorized"
            );
        }


        return bookingRepository.findByRide(ride)
                .stream()
                .map(this::mapToBookingResponse)
                .toList();
    }


    @Override
    public List<BookingResponse> getBookingHistory(
            String phoneNumber) {


        User user = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));


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
    @Override
    @Transactional
    public MessageResponse cancelBooking(
            Long bookingId,
            String phoneNumber) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));


        // Only passenger who created booking can cancel
        if (!booking.getUser()
                .getPhoneNumber()
                .equals(phoneNumber)) {

            throw new RuntimeException(
                    "You can cancel only your own booking"
            );
        }


        // Only pending or confirmed bookings can be cancelled
        if (booking.getStatus() != BookingStatus.PENDING &&
                booking.getStatus() != BookingStatus.CONFIRMED) {

            throw new RuntimeException(
                    "Booking cannot be cancelled"
            );
        }


        Ride ride = booking.getRide();


        // Restore seats if booking was confirmed
        if (booking.getStatus() == BookingStatus.CONFIRMED) {

            ride.setAvailableSeats(
                    ride.getAvailableSeats()
                            + booking.getSeatsBooked()
            );


            if (ride.getStatus() == RideStatus.FULL) {

                ride.setStatus(RideStatus.ACTIVE);
            }


            rideRepository.save(ride);
        }


        booking.setStatus(
                BookingStatus.CANCELLED
        );


        bookingRepository.save(booking);


        notificationService.createNotification(
                ride.getUser(),
                "Booking Cancelled",
                "A passenger cancelled the booking for your ride from "
                        + ride.getSource()
                        + " to "
                        + ride.getDestination()
        );


        return MessageResponse.builder()
                .message("Booking cancelled successfully")
                .build();
    }
}