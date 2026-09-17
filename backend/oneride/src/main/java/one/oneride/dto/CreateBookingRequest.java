package one.oneride.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class CreateBookingRequest {

    @NotNull(message = "Ride ID is required")
    private Long rideId;

    @NotNull(message = "Seats booked is required")
    @Min(value = 1, message = "At least one seat must be booked")
    private Integer seatsBooked;

    public CreateBookingRequest() {
    }

    public CreateBookingRequest(
            Long rideId,
            Integer seatsBooked) {

        this.rideId = rideId;
        this.seatsBooked = seatsBooked;
    }

    public Long getRideId() {
        return rideId;
    }

    public void setRideId(Long rideId) {
        this.rideId = rideId;
    }

    public Integer getSeatsBooked() {
        return seatsBooked;
    }

    public void setSeatsBooked(Integer seatsBooked) {
        this.seatsBooked = seatsBooked;
    }
}