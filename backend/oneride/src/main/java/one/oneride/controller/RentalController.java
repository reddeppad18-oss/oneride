package one.oneride.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import one.oneride.dto.CreateRentalRequest;
import one.oneride.dto.MessageResponse;
import one.oneride.dto.RentalResponse;
import one.oneride.service.RentalService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rentals")
@RequiredArgsConstructor
@CrossOrigin("*")
public class RentalController {


    private final RentalService rentalService;


    // Create rental listing
    @PostMapping
    public RentalResponse createRental(
            Authentication authentication,
             @Valid @RequestBody CreateRentalRequest request) {


        return rentalService.createRental(
                authentication.getName(),
                request
        );
    }


    // Owner's rental listings
    @GetMapping("/my")
    public List<RentalResponse> getMyRentals(
            Authentication authentication) {


        return rentalService.getMyRentals(
                authentication.getName()
        );
    }


    // Search rentals
    @GetMapping("/search")
    public List<RentalResponse> searchRentals(
            @RequestParam String location) {


        return rentalService.searchRentals(
                location
        );
    }


    // Get rental details
    @GetMapping("/{rentalId}")
    public RentalResponse getRentalById(
            @PathVariable Long rentalId) {


        return rentalService.getRentalById(
                rentalId
        );
    }


    // Update rental availability
    @PutMapping("/{rentalId}/status")
    public MessageResponse updateStatus(
            @PathVariable Long rentalId,
            @RequestParam String status,
            Authentication authentication) {


        return rentalService.updateRentalStatus(
                rentalId,
                authentication.getName(),
                status
        );
    }


    // Delete rental listing
    @DeleteMapping("/{rentalId}")
    public MessageResponse deleteRental(
            @PathVariable Long rentalId,
            Authentication authentication) {


        return rentalService.deleteRental(
                rentalId,
                authentication.getName()
        );
    }
}