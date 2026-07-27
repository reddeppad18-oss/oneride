package one.oneride.service;

import one.oneride.dto.CreateRideRequest;
import one.oneride.dto.MessageResponse;
import one.oneride.dto.RideResponse;
import org.springframework.data.domain.Page;

import java.time.LocalDate;
import java.util.List;

public interface RideService {

    void createRide(
            String phoneNumber,
            CreateRideRequest request
    );


    List<RideResponse> getMyRides(
            String phoneNumber
    );


    Page<RideResponse> searchRides(
            String source,
            String destination,
            LocalDate travelDate,
            Integer availableSeats,
            Double maxPrice,
            int page,
            int size,
            String sortBy
    );


    RideResponse getRideById(
            Long rideId
    );


    void cancelRide(
            Long rideId,
            String phoneNumber
    );


    MessageResponse startRide(
            Long rideId,
            String phoneNumber
    );


    MessageResponse completeRide(
            Long rideId,
            String phoneNumber
    );


    List<RideResponse> getRideHistory(
            String phoneNumber
    );
}