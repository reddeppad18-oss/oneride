package one.oneride.controller;

import lombok.RequiredArgsConstructor;
import one.oneride.dto.CreateRideRequest;
import one.oneride.dto.MessageResponse;
import one.oneride.dto.RideResponse;
import one.oneride.service.RideService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/rides")
@RequiredArgsConstructor
@CrossOrigin("*")
public class RideController {

    private final RideService rideService;

    @PostMapping
    public MessageResponse createRide(
            Authentication authentication,
            @RequestBody CreateRideRequest request) {

        String phoneNumber = authentication.getName();

        rideService.createRide(phoneNumber, request);

        return MessageResponse.builder()
                .message("Ride created successfully")
                .build();
    }
    @GetMapping("/my")
    public List<RideResponse> getMyRides(
            Authentication authentication) {

        String phoneNumber = authentication.getName();

        return rideService.getMyRides(phoneNumber);
    }
    @GetMapping("/search")
    public List<RideResponse> searchRides(

            @RequestParam String source,

            @RequestParam String destination,

            @RequestParam LocalDate travelDate) {

        return rideService.searchRides(
                source,
                destination,
                travelDate
        );
    }
    @GetMapping("/{rideId}")
    public RideResponse getRideById(@PathVariable Long rideId) {
        return rideService.getRideById(rideId);
    }
    @PutMapping("/{rideId}/cancel")
    public MessageResponse cancelRide(
            @PathVariable Long rideId,
            Authentication authentication) {

        String phoneNumber = authentication.getName();

        rideService.cancelRide(rideId, phoneNumber);

        return MessageResponse.builder()
                .message("Ride cancelled successfully")
                .build();
    }
    @PutMapping("/{rideId}/start")
    public MessageResponse startRide(
            @PathVariable Long rideId,
            Authentication authentication) {

        return rideService.startRide(
                rideId,
                authentication.getName()
        );
    }
    @PutMapping("/{rideId}/complete")
    public MessageResponse completeRide(
            @PathVariable Long rideId,
            Authentication authentication) {

        return rideService.completeRide(
                rideId,
                authentication.getName()
        );
    }
}