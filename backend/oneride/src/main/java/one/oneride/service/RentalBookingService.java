package one.oneride.service;

import one.oneride.dto.CreateRentalBookingRequest;
import one.oneride.dto.MessageResponse;
import one.oneride.dto.RentalBookingResponse;

import java.util.List;

public interface RentalBookingService {


    // Customer creates rental booking
    RentalBookingResponse createBooking(
            String phoneNumber,
            CreateRentalBookingRequest request
    );


    // Customer views own rental bookings
    List<RentalBookingResponse> getMyBookings(
            String phoneNumber
    );


    // Owner views booking requests for their vehicle
    List<RentalBookingResponse> getBookingsForRental(
            Long rentalId,
            String phoneNumber
    );


    // Owner accepts booking
    MessageResponse confirmBooking(
            Long bookingId,
            String phoneNumber
    );


    // Owner rejects booking
    MessageResponse rejectBooking(
            Long bookingId,
            String phoneNumber
    );


    // Customer cancels booking
    MessageResponse cancelBooking(
            Long bookingId,
            String phoneNumber
    );


    // Complete rental after return
    MessageResponse completeBooking(
            Long bookingId,
            String phoneNumber
    );
}