package one.oneride.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateBookingRequest {

    private Long rideId;

    private Integer seatsBooked;
}