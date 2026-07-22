package one.oneride.service;

import one.oneride.dto.CreateRideRequest;

public interface RideService {

    void createRide(String phoneNumber, CreateRideRequest request);
}