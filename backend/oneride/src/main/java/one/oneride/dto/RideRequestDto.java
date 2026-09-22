package one.oneride.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class RideRequestDto {

    private Long id;

    private Long customerId;

    private String customerName;

    private String pickupAddress;

    private Double pickupLatitude;

    private Double pickupLongitude;

    private String destinationAddress;

    private Double destinationLatitude;

    private Double destinationLongitude;

    private Integer requestedSeats;

    private Double offeredPrice;

    private Boolean negotiable;

    private String status;

    private Double finalPrice;

    private LocalDateTime createdAt;
}