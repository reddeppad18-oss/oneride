package one.oneride.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BookingResponse {

    private Long bookingId;

    private Long rideId;

    private String source;

    private String destination;

    private Integer seatsBooked;

    private String bookingStatus;
}