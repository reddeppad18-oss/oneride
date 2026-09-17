package one.oneride.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import one.oneride.dto.BookingResponse;
import one.oneride.dto.CreateBookingRequest;
import one.oneride.dto.MessageResponse;
import one.oneride.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin("*")
public class BookingController {

    private final BookingService bookingService;


    // =========================================================
    // CREATE BOOKING
    // =========================================================

    @PostMapping
    public BookingResponse createBooking(
            Authentication authentication,
            @Valid @RequestBody CreateBookingRequest request) {

        String phoneNumber =
                authentication.getName();

        return bookingService.createBooking(
                phoneNumber,
                request
        );
    }


    // =========================================================
    // GET MY BOOKINGS
    // =========================================================

    @GetMapping("/my")
    public List<BookingResponse> getMyBookings(
            Authentication authentication) {

        String phoneNumber =
                authentication.getName();

        return bookingService.getMyBookings(
                phoneNumber
        );
    }


    // =========================================================
    // GET BOOKINGS FOR MY RIDE
    // =========================================================

    @GetMapping("/ride/{rideId}")
    public List<BookingResponse> getBookingsForRide(
            @PathVariable Long rideId,
            Authentication authentication) {

        String phoneNumber =
                authentication.getName();

        return bookingService.getBookingsForRide(
                rideId,
                phoneNumber
        );
    }


    // =========================================================
    // CONFIRM BOOKING
    // =========================================================

    @PutMapping("/{bookingId}/confirm")
    public MessageResponse confirmBooking(
            @PathVariable Long bookingId,
            Authentication authentication) {

        String phoneNumber =
                authentication.getName();

        return bookingService.confirmBooking(
                bookingId,
                phoneNumber
        );
    }


    // =========================================================
    // REJECT BOOKING
    // =========================================================

    @PutMapping("/{bookingId}/reject")
    public MessageResponse rejectBooking(
            @PathVariable Long bookingId,
            Authentication authentication) {

        String phoneNumber =
                authentication.getName();

        return bookingService.rejectBooking(
                bookingId,
                phoneNumber
        );
    }


    // =========================================================
    // CANCEL BOOKING
    // =========================================================

    @PutMapping("/{bookingId}/cancel")
    public MessageResponse cancelBooking(
            @PathVariable Long bookingId,
            Authentication authentication) {

        String phoneNumber =
                authentication.getName();

        return bookingService.cancelBooking(
                bookingId,
                phoneNumber
        );
    }


    // =========================================================
    // BOOKING HISTORY
    // =========================================================

    @GetMapping("/history")
    public List<BookingResponse> getBookingHistory(
            Authentication authentication) {

        String phoneNumber =
                authentication.getName();

        return bookingService.getBookingHistory(
                phoneNumber
        );
    }
}