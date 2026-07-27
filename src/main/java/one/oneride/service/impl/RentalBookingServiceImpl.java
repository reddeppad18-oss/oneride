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



    @Override
    public RentalBookingResponse createBooking(
            String phoneNumber,
            CreateRentalBookingRequest request) {


        User customer =
                userRepository.findByPhoneNumber(phoneNumber)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"));



        RentalListing rental =
                rentalRepository.findById(request.getRentalId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Rental not found"));



        if (rental.getOwner()
                .getId()
                .equals(customer.getId())) {

            throw new RuntimeException(
                    "You cannot book your own vehicle");
        }



        if (rental.getStatus()
                != RentalStatus.AVAILABLE) {

            throw new RuntimeException(
                    "Vehicle is not available");
        }



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
                    "You already booked this vehicle");
        }



        long days =
                ChronoUnit.DAYS.between(
                        request.getStartDate(),
                        request.getEndDate()
                ) + 1;



        if (days <= 0) {

            throw new RuntimeException(
                    "Invalid rental dates");
        }



        double totalAmount =
                days * rental.getPricePerDay();



        RentalBooking booking =
                RentalBooking.builder()
                        .rentalListing(rental)
                        .customer(customer)
                        .startDate(request.getStartDate())
                        .endDate(request.getEndDate())
                        .totalDays((int) days)
                        .totalAmount(totalAmount)
                        .status(RentalBookingStatus.PENDING)
                        .createdAt(LocalDateTime.now())
                        .build();



        booking =
                rentalBookingRepository.save(booking);



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



    @Override
    public List<RentalBookingResponse> getMyBookings(
            String phoneNumber) {


        User customer =
                userRepository.findByPhoneNumber(phoneNumber)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"));


        return rentalBookingRepository
                .findByCustomer(customer)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }




    @Override
    public List<RentalBookingResponse> getBookingsForRental(
            Long rentalId,
            String phoneNumber) {


        RentalListing rental =
                rentalRepository.findById(rentalId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Rental not found"));



        if (!rental.getOwner()
                .getPhoneNumber()
                .equals(phoneNumber)) {

            throw new RuntimeException(
                    "Unauthorized");
        }



        return rentalBookingRepository
                .findByRentalListing(rental)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }




    @Override
    public MessageResponse confirmBooking(
            Long bookingId,
            String phoneNumber) {


        RentalBooking booking =
                getBooking(bookingId);



        if (!booking.getRentalListing()
                .getOwner()
                .getPhoneNumber()
                .equals(phoneNumber)) {

            throw new RuntimeException(
                    "Unauthorized");
        }



        booking.setStatus(
                RentalBookingStatus.CONFIRMED
        );


        booking.getRentalListing()
                .setStatus(RentalStatus.BOOKED);



        rentalBookingRepository.save(booking);



        notificationService.createNotification(
                booking.getCustomer(),
                "Rental Confirmed",
                "Your rental booking has been confirmed"
        );



        return MessageResponse.builder()
                .message(
                        "Rental booking confirmed")
                .build();
    }





    @Override
    public MessageResponse rejectBooking(
            Long bookingId,
            String phoneNumber) {


        RentalBooking booking =
                getBooking(bookingId);



        if (!booking.getRentalListing()
                .getOwner()
                .getPhoneNumber()
                .equals(phoneNumber)) {

            throw new RuntimeException(
                    "Unauthorized");
        }



        booking.setStatus(
                RentalBookingStatus.REJECTED
        );


        rentalBookingRepository.save(booking);



        return MessageResponse.builder()
                .message(
                        "Rental booking rejected")
                .build();
    }





    @Override
    public MessageResponse cancelBooking(
            Long bookingId,
            String phoneNumber) {


        RentalBooking booking =
                getBooking(bookingId);



        if (!booking.getCustomer()
                .getPhoneNumber()
                .equals(phoneNumber)) {

            throw new RuntimeException(
                    "Unauthorized");
        }



        booking.setStatus(
                RentalBookingStatus.CANCELLED
        );


        booking.getRentalListing()
                .setStatus(RentalStatus.AVAILABLE);



        rentalBookingRepository.save(booking);



        return MessageResponse.builder()
                .message(
                        "Rental booking cancelled")
                .build();
    }





    @Override
    public MessageResponse completeBooking(
            Long bookingId,
            String phoneNumber) {


        RentalBooking booking =
                getBooking(bookingId);



        if (!booking.getRentalListing()
                .getOwner()
                .getPhoneNumber()
                .equals(phoneNumber)) {

            throw new RuntimeException(
                    "Unauthorized");
        }



        booking.setStatus(
                RentalBookingStatus.COMPLETED
        );


        booking.getRentalListing()
                .setStatus(
                        RentalStatus.AVAILABLE
                );



        rentalBookingRepository.save(booking);



        return MessageResponse.builder()
                .message(
                        "Rental completed successfully")
                .build();
    }





    private RentalBooking getBooking(Long id) {

        return rentalBookingRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Booking not found"));
    }





    private RentalBookingResponse mapToResponse(
            RentalBooking booking) {


        RentalListing rental =
                booking.getRentalListing();



        return RentalBookingResponse.builder()
                .bookingId(booking.getId())
                .rentalId(rental.getId())
                .vehicleType(rental.getVehicleType())
                .brand(rental.getBrand())
                .model(rental.getModel())
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