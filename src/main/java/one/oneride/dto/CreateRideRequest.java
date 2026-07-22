package one.oneride.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class CreateRideRequest {

    private String source;

    private String destination;

    private LocalDate travelDate;

    private LocalTime travelTime;

    private Integer availableSeats;

    private Double pricePerSeat;

    private String description;
}