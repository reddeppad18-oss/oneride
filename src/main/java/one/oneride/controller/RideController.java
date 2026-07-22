package one.oneride.controller;

import lombok.RequiredArgsConstructor;
import one.oneride.dto.CreateRideRequest;
import one.oneride.service.RideService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rides")
@RequiredArgsConstructor
@CrossOrigin("*")
public class RideController {

    private final RideService rideService;

    @PostMapping
    public String createRide(
            Authentication authentication,
            @RequestBody CreateRideRequest request) {

        String phoneNumber = authentication.getName();

        rideService.createRide(phoneNumber, request);

        return "Ride created successfully";
    }
}