package one.oneride.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Builder
public class RideResponse {

    private Long id;

    private String source;

    private String destination;

    private LocalDate travelDate;

    private LocalTime travelTime;

    private Integer availableSeats;

    private Double pricePerSeat;

    private String description;

    private String status;
}