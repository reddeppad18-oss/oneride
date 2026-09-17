package one.oneride.service;

import java.util.List;

import one.oneride.dto.BookingResponse;
import one.oneride.dto.CreateBookingRequest;
import one.oneride.dto.MessageResponse;

public interface BookingService {

    BookingResponse createBooking(
            String phoneNumber,
            CreateBookingRequest request
    );

    List<BookingResponse> getMyBookings(
            String phoneNumber
    );

    MessageResponse confirmBooking(
            Long bookingId,
            String phoneNumber
    );

    MessageResponse rejectBooking(
            Long bookingId,
            String phoneNumber
    );

    MessageResponse cancelBooking(
            Long bookingId,
            String phoneNumber
    );

    List<BookingResponse> getBookingsForRide(
            Long rideId,
            String phoneNumber
    );

    List<BookingResponse> getBookingHistory(
            String phoneNumber
    );
}