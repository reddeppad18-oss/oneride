package one.oneride.service;

import one.oneride.dto.BookingResponse;
import one.oneride.dto.CreateBookingRequest;
import one.oneride.dto.MessageResponse;

import java.util.List;

public interface BookingService {

    BookingResponse createBooking(
            String phoneNumber,
            CreateBookingRequest request
    );
    List<BookingResponse> getMyBookings(String phoneNumber);
    MessageResponse confirmBooking(
            Long bookingId,
            String phoneNumber
    );
    MessageResponse rejectBooking(
            Long bookingId,
            String phoneNumber
    );
    List<BookingResponse> getBookingsForRide(
            Long rideId,
            String phoneNumber
    );
}