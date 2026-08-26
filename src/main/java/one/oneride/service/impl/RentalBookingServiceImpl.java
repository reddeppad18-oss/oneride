package one.oneride.service.impl;

import lombok.RequiredArgsConstructor;
import one.oneride.dto.CreateRentalBookingRequest;
import one.oneride.dto.MessageResponse;
import one.oneride.dto.RentalBookingResponse;
import one.oneride.entity.RentalBooking;
import one.oneride.entity.RentalListing;
import one.oneride.entity.User;
import one.oneride.enums.RentalBookingStatus;
import one.oneride.enums.RentalStatus;
import one.oneride.repository.RentalBookingRepository;
import one.oneride.repository.RentalRepository;
import one.oneride.repository.UserRepository;
import one.oneride.service.NotificationService;
import one.oneride.service.RentalBookingService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RentalBookingServiceImpl
        implements RentalBookingService {


    private final RentalBookingRepository rentalBookingRepository;

    private final RentalRepository rentalRepository;

    private final UserRepository userRepository;

    private final NotificationService notificationService;


    // =========================================================
    // CREATE RENTAL BOOKING
    // =========================================================

    @Override
    public RentalBookingResponse createBooking(
            String phoneNumber,
            CreateRentalBookingRequest request) {

        User customer =
                userRepository.findByPhoneNumber(phoneNumber)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));


        RentalListing rental =
                rentalRepository.findById(request.getRentalId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Rental not found"
                                ));


        // Customer cannot book own vehicle
        if (rental.getOwner()
                .getId()
                .equals(customer.getId())) {

            throw new RuntimeException(
                    "You cannot book your own vehicle"
            );
        }


        // Vehicle must be available
        if (rental.getStatus()
                != RentalStatus.AVAILABLE) {

            throw new RuntimeException(
                    "Vehicle is not available"
            );
        }


        // Check existing active booking
        List<RentalBookingStatus> activeStatuses =
                List.of(
                        RentalBookingStatus.PENDING,
                        RentalBookingStatus.CONFIRMED
                );


        boolean alreadyBooked =
                rentalBookingRepository
                        .existsByRentalListingIdAndCustomerIdAndStatusIn(
                                rental.getId(),
                                customer.getId(),
                                activeStatuses
                        );


        if (alreadyBooked) {

            throw new RuntimeException(
                    "You already booked this vehicle"
            );
        }


        // Calculate number of days
        long days =
                ChronoUnit.DAYS.between(
                        request.getStartDate(),
                        request.getEndDate()
                ) + 1;


        if (days <= 0) {

            throw new RuntimeException(
                    "Invalid rental dates"
            );
        }


        // Calculate total amount
        double totalAmount =
                days * rental.getPricePerDay();


        // Create booking
        RentalBooking booking =
                RentalBooking.builder()
                        .rentalListing(rental)
                        .customer(customer)
                        .startDate(request.getStartDate())
                        .endDate(request.getEndDate())
                        .totalDays((int) days)
                        .totalAmount(totalAmount)
                        .status(
                                RentalBookingStatus.PENDING
                        )
                        .createdAt(
                                LocalDateTime.now()
                        )
                        .build();


        booking =
                rentalBookingRepository.save(
                        booking
                );


        // Notify owner
        notificationService.createNotification(
                rental.getOwner(),
                "New Rental Booking",
                customer.getFullName()
                        + " requested your "
                        + rental.getBrand()
                        + " "
                        + rental.getModel()
        );


        return mapToResponse(booking);
    }


    // =========================================================
    // CUSTOMER - MY RENTAL BOOKINGS
    // =========================================================

    @Override
    public List<RentalBookingResponse> getMyBookings(
            String phoneNumber) {

        User customer =
                userRepository.findByPhoneNumber(phoneNumber)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));


        return rentalBookingRepository
                .findByCustomer(customer)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =========================================================
    // OWNER - BOOKINGS FOR RENTAL
    // =========================================================

    @Override
    public List<RentalBookingResponse> getBookingsForRental(
            Long rentalId,
            String phoneNumber) {

        RentalListing rental =
                rentalRepository.findById(rentalId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Rental not found"
                                ));


        // Only owner can view requests
        if (!rental.getOwner()
                .getPhoneNumber()
                .equals(phoneNumber)) {

            throw new RuntimeException(
                    "Unauthorized"
            );
        }


        return rentalBookingRepository
                .findByRentalListing(rental)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =========================================================
    // OWNER - CONFIRM BOOKING
    // =========================================================

    @Override
    @Transactional
    public MessageResponse confirmBooking(
            Long bookingId,
            String phoneNumber) {

        RentalBooking booking =
                getBooking(bookingId);


        RentalListing rental =
                booking.getRentalListing();


        // Only owner can confirm
        if (!rental.getOwner()
                .getPhoneNumber()
                .equals(phoneNumber)) {

            throw new RuntimeException(
                    "Unauthorized"
            );
        }


        // Only PENDING bookings can be confirmed
        if (booking.getStatus()
                != RentalBookingStatus.PENDING) {

            throw new RuntimeException(
                    "Only pending bookings can be confirmed"
            );
        }


        // Rental must still be available
        if (rental.getStatus()
                != RentalStatus.AVAILABLE) {

            throw new RuntimeException(
                    "Vehicle is no longer available"
            );
        }


        // Confirm booking
        booking.setStatus(
                RentalBookingStatus.CONFIRMED
        );


        // Mark vehicle as booked
        rental.setStatus(
                RentalStatus.BOOKED
        );


        rentalBookingRepository.save(
                booking
        );

        rentalRepository.save(
                rental
        );


        // Notify customer
        notificationService.createNotification(
                booking.getCustomer(),
                "Rental Confirmed",
                "Your rental booking for "
                        + rental.getBrand()
                        + " "
                        + rental.getModel()
                        + " has been confirmed."
        );


        return MessageResponse.builder()
                .message(
                        "Rental booking confirmed"
                )
                .build();
    }


    // =========================================================
    // OWNER - REJECT BOOKING
    // =========================================================

    @Override
    public MessageResponse rejectBooking(
            Long bookingId,
            String phoneNumber) {

        RentalBooking booking =
                getBooking(bookingId);


        RentalListing rental =
                booking.getRentalListing();


        // Only owner can reject
        if (!rental.getOwner()
                .getPhoneNumber()
                .equals(phoneNumber)) {

            throw new RuntimeException(
                    "Unauthorized"
            );
        }


        // Only PENDING bookings can be rejected
        if (booking.getStatus()
                != RentalBookingStatus.PENDING) {

            throw new RuntimeException(
                    "Only pending bookings can be rejected"
            );
        }


        booking.setStatus(
                RentalBookingStatus.REJECTED
        );


        rentalBookingRepository.save(
                booking
        );


        // Notify customer
        notificationService.createNotification(
                booking.getCustomer(),
                "Rental Booking Rejected",
                "Your rental booking for "
                        + rental.getBrand()
                        + " "
                        + rental.getModel()
                        + " has been rejected."
        );


        return MessageResponse.builder()
                .message(
                        "Rental booking rejected"
                )
                .build();
    }


    // =========================================================
    // CUSTOMER - CANCEL BOOKING
    // =========================================================

    @Override
    public MessageResponse cancelBooking(
            Long bookingId,
            String phoneNumber) {

        RentalBooking booking =
                getBooking(bookingId);


        RentalListing rental =
                booking.getRentalListing();


        // Only the customer who created
        // the booking can cancel it
        if (!booking.getCustomer()
                .getPhoneNumber()
                .equals(phoneNumber)) {

            throw new RuntimeException(
                    "You can cancel only your own rental booking"
            );
        }


        // Only PENDING bookings can be cancelled
        if (booking.getStatus()
                != RentalBookingStatus.PENDING) {

            throw new RuntimeException(
                    "Only pending rental bookings can be cancelled"
            );
        }


        // Change booking status
        booking.setStatus(
                RentalBookingStatus.CANCELLED
        );


        rentalBookingRepository.save(
                booking
        );


        // Notify owner
        notificationService.createNotification(
                rental.getOwner(),
                "Rental Booking Cancelled",
                booking.getCustomer().getFullName()
                        + " cancelled the rental booking for "
                        + rental.getBrand()
                        + " "
                        + rental.getModel()
        );


        return MessageResponse.builder()
                .message(
                        "Rental booking cancelled successfully"
                )
                .build();
    }


    // =========================================================
    // OWNER - COMPLETE BOOKING
    // =========================================================

    @Override
    public MessageResponse completeBooking(
            Long bookingId,
            String phoneNumber) {

        RentalBooking booking =
                getBooking(bookingId);


        RentalListing rental =
                booking.getRentalListing();


        // Only owner can complete
        if (!rental.getOwner()
                .getPhoneNumber()
                .equals(phoneNumber)) {

            throw new RuntimeException(
                    "Unauthorized"
            );
        }


        // Only CONFIRMED bookings can be completed
        if (booking.getStatus()
                != RentalBookingStatus.CONFIRMED) {

            throw new RuntimeException(
                    "Only confirmed bookings can be completed"
            );
        }


        // Complete booking
        booking.setStatus(
                RentalBookingStatus.COMPLETED
        );


        // Make vehicle available again
        rental.setStatus(
                RentalStatus.AVAILABLE
        );


        rentalBookingRepository.save(
                booking
        );

        rentalRepository.save(
                rental
        );


        // Notify customer
        notificationService.createNotification(
                booking.getCustomer(),
                "Rental Completed",
                "Your rental booking for "
                        + rental.getBrand()
                        + " "
                        + rental.getModel()
                        + " has been completed."
        );


        return MessageResponse.builder()
                .message(
                        "Rental completed successfully"
                )
                .build();
    }


    // =========================================================
    // FIND BOOKING
    // =========================================================

    private RentalBooking getBooking(
            Long id) {

        return rentalBookingRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Booking not found"
                        ));
    }


    // =========================================================
    // MAP ENTITY TO RESPONSE
    // =========================================================

    private RentalBookingResponse mapToResponse(
            RentalBooking booking) {

        RentalListing rental =
                booking.getRentalListing();


        return RentalBookingResponse.builder()

                .bookingId(
                        booking.getId()
                )

                .rentalId(
                        rental.getId()
                )

                .vehicleType(
                        rental.getVehicleType()
                )

                .brand(
                        rental.getBrand()
                )

                .model(
                        rental.getModel()
                )

                .customerName(
                        booking.getCustomer()
                                .getFullName()
                )

                .ownerName(
                        rental.getOwner()
                                .getFullName()
                )

                .startDate(
                        booking.getStartDate()
                                .toString()
                )

                .endDate(
                        booking.getEndDate()
                                .toString()
                )

                .totalDays(
                        booking.getTotalDays()
                )

                .totalAmount(
                        booking.getTotalAmount()
                )

                .bookingStatus(
                        booking.getStatus()
                                .name()
                )

                .build();
    }
}