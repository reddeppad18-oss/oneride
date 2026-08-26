package one.oneride.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateBookingRequest {


    @NotNull(message = "Ride ID is required")
    private Long rideId;


    @NotNull(message = "Seats booked is required")
    @Min(value = 1, message = "At least one seat must be booked")
    private Integer seatsBooked;
}