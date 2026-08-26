package one.oneride.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import one.oneride.dto.CreateRideRequest;
import one.oneride.dto.MessageResponse;
import one.oneride.dto.RideResponse;
import one.oneride.service.RideService;
import org.springframework.data.domain.Page;
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
            @RequestBody @Valid CreateRideRequest request) {


        String phoneNumber = authentication.getName();


        rideService.createRide(
                phoneNumber,
                request
        );


        return MessageResponse.builder()
                .message("Ride created successfully")
                .build();
    }



    @GetMapping("/my")
    public List<RideResponse> getMyRides(
            Authentication authentication) {


        return rideService.getMyRides(
                authentication.getName()
        );
    }




    @GetMapping("/search")
    public Page<RideResponse> searchRides(


            @RequestParam(required = false)
            String source,


            @RequestParam(required = false)
            String destination,


            @RequestParam(required = false)
            LocalDate travelDate,


            @RequestParam(required = false)
            Integer availableSeats,


            @RequestParam(required = false)
            Double maxPrice,


            @RequestParam(defaultValue = "0")
            int page,


            @RequestParam(defaultValue = "10")
            int size,


            @RequestParam(defaultValue = "travelDate")
            String sortBy

    ) {


        return rideService.searchRides(
                source,
                destination,
                travelDate,
                availableSeats,
                maxPrice,
                page,
                size,
                sortBy
        );
    }




    @GetMapping("/{rideId}")
    public RideResponse getRideById(
            @PathVariable Long rideId) {


        return rideService.getRideById(
                rideId
        );
    }




    @PutMapping("/{rideId}/cancel")
    public MessageResponse cancelRide(

            @PathVariable Long rideId,

            Authentication authentication

    ) {


        rideService.cancelRide(
                rideId,
                authentication.getName()
        );


        return MessageResponse.builder()
                .message("Ride cancelled successfully")
                .build();
    }




    @PutMapping("/{rideId}/start")
    public MessageResponse startRide(

            @PathVariable Long rideId,

            Authentication authentication

    ) {


        return rideService.startRide(
                rideId,
                authentication.getName()
        );
    }





    @PutMapping("/{rideId}/complete")
    public MessageResponse completeRide(

            @PathVariable Long rideId,

            Authentication authentication

    ) {


        return rideService.completeRide(
                rideId,
                authentication.getName()
        );
    }




    @GetMapping("/history")
    public List<RideResponse> getRideHistory(

            Authentication authentication

    ) {


        return rideService.getRideHistory(
                authentication.getName()
        );
    }
}