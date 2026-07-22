package one.oneride.service.impl;

import lombok.RequiredArgsConstructor;
import one.oneride.dto.CreateRideRequest;
import one.oneride.entity.Ride;
import one.oneride.entity.User;
import one.oneride.enums.RideStatus;
import one.oneride.repository.RideRepository;
import one.oneride.repository.UserRepository;
import one.oneride.service.RideService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

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
}