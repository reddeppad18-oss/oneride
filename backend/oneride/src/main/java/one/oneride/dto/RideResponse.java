package one.oneride.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RideResponse {

    private Long id;

    private Long driverId;

    private String source;

    private String destination;

    private LocalDate travelDate;

    private LocalTime travelTime;

    private Integer availableSeats;

    private Double pricePerSeat;

    private String description;

    private String status;

    private String vehicleType;

    private String vehicleName;

    private String vehicleNumber;
}
