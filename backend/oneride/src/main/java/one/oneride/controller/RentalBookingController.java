package one.oneride.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import one.oneride.dto.CreateRentalBookingRequest;
import one.oneride.dto.MessageResponse;
import one.oneride.dto.RentalBookingResponse;
import one.oneride.service.RentalBookingService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rental-bookings")
@RequiredArgsConstructor
@CrossOrigin("*")
public class RentalBookingController {


    private final RentalBookingService rentalBookingService;



    // Customer creates booking
    @PostMapping
    public RentalBookingResponse createBooking(
            Authentication authentication,
            @Valid @RequestBody CreateRentalBookingRequest request) {


        return rentalBookingService.createBooking(
                authentication.getName(),
                request
        );
    }




    // Customer views own bookings
    @GetMapping("/my")
    public List<RentalBookingResponse> getMyBookings(
            Authentication authentication) {


        return rentalBookingService.getMyBookings(
                authentication.getName()
        );
    }




    // Owner views booking requests for vehicle
    @GetMapping("/rental/{rentalId}")
    public List<RentalBookingResponse> getBookingsForRental(
            @PathVariable Long rentalId,
            Authentication authentication) {


        return rentalBookingService.getBookingsForRental(
                rentalId,
                authentication.getName()
        );
    }





    // Owner confirms booking
    @PutMapping("/{bookingId}/confirm")
    public MessageResponse confirmBooking(
            @PathVariable Long bookingId,
            Authentication authentication) {


        return rentalBookingService.confirmBooking(
                bookingId,
                authentication.getName()
        );
    }





    // Owner rejects booking
    @PutMapping("/{bookingId}/reject")
    public MessageResponse rejectBooking(
            @PathVariable Long bookingId,
            Authentication authentication) {


        return rentalBookingService.rejectBooking(
                bookingId,
                authentication.getName()
        );
    }





    // Customer cancels booking
    @PutMapping("/{bookingId}/cancel")
    public MessageResponse cancelBooking(
            @PathVariable Long bookingId,
            Authentication authentication) {


        return rentalBookingService.cancelBooking(
                bookingId,
                authentication.getName()
        );
    }





    // Owner completes rental
    @PutMapping("/{bookingId}/complete")
    public MessageResponse completeBooking(
            @PathVariable Long bookingId,
            Authentication authentication) {


        return rentalBookingService.completeBooking(
                bookingId,
                authentication.getName()
        );
    }
}