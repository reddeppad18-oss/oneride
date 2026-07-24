package one.oneride.controller;

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

    @PostMapping
    public BookingResponse createBooking(
            Authentication authentication,
            @RequestBody CreateBookingRequest request) {

        String phoneNumber = authentication.getName();

        return bookingService.createBooking(
                phoneNumber,
                request
        );
    }
    @GetMapping("/my")
    public List<BookingResponse> getMyBookings(
            Authentication authentication) {

        return bookingService.getMyBookings(
                authentication.getName()
        );
    }
    @PutMapping("/{bookingId}/confirm")
    public MessageResponse confirmBooking(
            @PathVariable Long bookingId,
            Authentication authentication) {

        return bookingService.confirmBooking(
                bookingId,
                authentication.getName()
        );
    }
    @PutMapping("/{bookingId}/reject")
    public MessageResponse rejectBooking(
            @PathVariable Long bookingId,
            Authentication authentication) {

        return bookingService.rejectBooking(
                bookingId,
                authentication.getName()
        );
    }
    @GetMapping("/ride/{rideId}")
    public List<BookingResponse> getBookingsForRide(
            @PathVariable Long rideId,
            Authentication authentication) {

        return bookingService.getBookingsForRide(
                rideId,
                authentication.getName()
        );
    }
}