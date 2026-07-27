package one.oneride.service.impl;

import lombok.RequiredArgsConstructor;
import one.oneride.dto.CreateRideRequest;
import one.oneride.dto.MessageResponse;
import one.oneride.dto.RideResponse;
import one.oneride.entity.Ride;
import one.oneride.entity.User;
import one.oneride.enums.RideStatus;
import one.oneride.exception.InvalidRideStateException;
import one.oneride.exception.RideNotFoundException;
import one.oneride.exception.UnauthorizedRideException;
import one.oneride.repository.RideRepository;
import one.oneride.repository.UserRepository;
import one.oneride.service.RideService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RideServiceImpl implements RideService {

    private final RideRepository rideRepository;
    private final UserRepository userRepository;

    @Override
    public void createRide(String phoneNumber,
                           CreateRideRequest request) {

        User user = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Ride ride = Ride.builder()
                .source(request.getSource())
                .destination(request.getDestination())
                .travelDate(request.getTravelDate())
                .travelTime(request.getTravelTime())
                .availableSeats(request.getAvailableSeats())
                .pricePerSeat(request.getPricePerSeat())
                .description(request.getDescription())
                .status(RideStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();

        rideRepository.save(ride);
    }
        @Override
        public List<RideResponse> getMyRides(String phoneNumber) {

            User user = userRepository.findByPhoneNumber(phoneNumber)
                    .orElseThrow(() ->
                            new RuntimeException("User not found"));

            List<Ride> rides = rideRepository.findByUser(user);

            return rides.stream()
                    .map(ride -> RideResponse.builder()
                            .id(ride.getId())
                            .source(ride.getSource())
                            .destination(ride.getDestination())
                            .travelDate(ride.getTravelDate())
                            .travelTime(ride.getTravelTime())
                            .availableSeats(ride.getAvailableSeats())
                            .pricePerSeat(ride.getPricePerSeat())
                            .description(ride.getDescription())
                            .status(ride.getStatus().name())
                            .build())
                    .toList();
        }

    @Override
    public List<RideResponse> searchRides(
            String source,
            String destination,
            LocalDate travelDate) {

        List<Ride> rides =
                rideRepository.findBySourceIgnoreCaseAndDestinationIgnoreCaseAndTravelDateAndStatus(
                        source,
                        destination,
                        travelDate,
                        RideStatus.ACTIVE
                );

        return rides.stream()
                .map(ride -> RideResponse.builder()
                        .id(ride.getId())
                        .source(ride.getSource())
                        .destination(ride.getDestination())
                        .travelDate(ride.getTravelDate())
                        .travelTime(ride.getTravelTime())
                        .availableSeats(ride.getAvailableSeats())
                        .pricePerSeat(ride.getPricePerSeat())
                        .description(ride.getDescription())
                        .status(ride.getStatus().name())
                        .build())
                .toList();
    }
    @Override
    public RideResponse getRideById(Long rideId) {

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() ->
                        new RuntimeException("Ride not found"));

        return RideResponse.builder()
                .id(ride.getId())
                .source(ride.getSource())
                .destination(ride.getDestination())
                .travelDate(ride.getTravelDate())
                .travelTime(ride.getTravelTime())
                .availableSeats(ride.getAvailableSeats())
                .pricePerSeat(ride.getPricePerSeat())
                .description(ride.getDescription())
                .status(ride.getStatus().name())
                .build();
    }
    private RideResponse mapToRideResponse(Ride ride) {

        return RideResponse.builder()
                .id(ride.getId())
                .source(ride.getSource())
                .destination(ride.getDestination())
                .travelDate(ride.getTravelDate())
                .travelTime(ride.getTravelTime())
                .availableSeats(ride.getAvailableSeats())
                .pricePerSeat(ride.getPricePerSeat())
                .description(ride.getDescription())
                .status(ride.getStatus().name())
                .build();
    }
    @Override
    public void cancelRide(
            Long rideId,
            String phoneNumber) {

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() ->
                        new RideNotFoundException("Ride not found"));

        if (!ride.getUser()
                .getPhoneNumber()
                .equals(phoneNumber)) {

            throw new UnauthorizedRideException(
                    "You can cancel only your own ride");
        }

        if (ride.getStatus() != RideStatus.ACTIVE) {

            throw new InvalidRideStateException(
                    "Only active rides can be cancelled");
        }

        ride.setStatus(RideStatus.CANCELLED);

        rideRepository.save(ride);
    }
    @Override
    public MessageResponse startRide(
            Long rideId,
            String phoneNumber) {

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() ->
                        new RuntimeException("Ride not found"));

        // Only ride owner can start the ride
        if (!ride.getUser().getPhoneNumber().equals(phoneNumber)) {
            throw new RuntimeException("Unauthorized");
        }

        // Ride must be ACTIVE or FULL
        if (ride.getStatus() != RideStatus.ACTIVE &&
                ride.getStatus() != RideStatus.FULL) {

            throw new RuntimeException("Ride cannot be started");
        }

        ride.setStatus(RideStatus.STARTED);

        rideRepository.save(ride);

        return MessageResponse.builder()
                .message("Ride started successfully")
                .build();
    }
    @Override
    public MessageResponse completeRide(
            Long rideId,
            String phoneNumber) {

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() ->
                        new RuntimeException("Ride not found"));

        // Only ride owner can complete the ride
        if (!ride.getUser().getPhoneNumber().equals(phoneNumber)) {
            throw new RuntimeException("Unauthorized");
        }

        // Ride must already be STARTED
        if (ride.getStatus() != RideStatus.STARTED) {
            throw new RuntimeException("Ride has not started yet");
        }

        ride.setStatus(RideStatus.COMPLETED);

        rideRepository.save(ride);

        return MessageResponse.builder()
                .message("Ride completed successfully")
                .build();
    }

    @Override
    public List<RideResponse> getRideHistory(String phoneNumber) {

        User user = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        List<RideStatus> historyStatuses = List.of(
                RideStatus.COMPLETED,
                RideStatus.CANCELLED
        );

        return rideRepository
                .findByUserAndStatusIn(user, historyStatuses)
                .stream()
                .map(this::mapToRideResponse)
                .toList();
    }
}
