package one.oneride.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import one.oneride.dto.BookingResponse;
import one.oneride.dto.CreateBookingRequest;
import one.oneride.dto.MessageResponse;
import one.oneride.service.BookingService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin("*")
public class BookingController {

    private final BookingService bookingService;

    // Create a new booking
    @PostMapping
    public BookingResponse createBooking(
            Authentication authentication,
            @Valid @RequestBody CreateBookingRequest request) {

        String phoneNumber = authentication.getName();

        return bookingService.createBooking(
                phoneNumber,
                request
        );
    }

    // Get bookings created by the current user
    @GetMapping("/my")
    public List<BookingResponse> getMyBookings(
            Authentication authentication) {

        return bookingService.getMyBookings(
                authentication.getName()
        );
    }

    // Confirm a booking
    @PutMapping("/{bookingId}/confirm")
    public MessageResponse confirmBooking(
            @PathVariable Long bookingId,
            Authentication authentication) {

        return bookingService.confirmBooking(
                bookingId,
                authentication.getName()
        );
    }

    // Reject a booking
    @PutMapping("/{bookingId}/reject")
    public MessageResponse rejectBooking(
            @PathVariable Long bookingId,
            Authentication authentication) {

        return bookingService.rejectBooking(
                bookingId,
                authentication.getName()
        );
    }

    // Get all bookings for a particular ride
    @GetMapping("/ride/{rideId}")
    public List<BookingResponse> getBookingsForRide(
            @PathVariable Long rideId,
            Authentication authentication) {

        return bookingService.getBookingsForRide(
                rideId,
                authentication.getName()
        );
    }

    // Get booking history
    @GetMapping("/history")
    public List<BookingResponse> getBookingHistory(
            Authentication authentication) {

        return bookingService.getBookingHistory(
                authentication.getName()
        );
    }

    // Cancel a booking
    @PutMapping("/{bookingId}/cancel")
    public MessageResponse cancelBooking(
            @PathVariable Long bookingId,
            Authentication authentication) {

        return bookingService.cancelBooking(
                bookingId,
                authentication.getName()
        );
    }
}