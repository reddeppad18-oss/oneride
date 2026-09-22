package one.oneride.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class RentalRequestDto {

    private Long id;

    private Long customerId;

    private String customerName;

    private String vehicleType;

    private String pickupAddress;

    private Double pickupLatitude;

    private Double pickupLongitude;

    private LocalDate startDate;

    private LocalDate endDate;

    private Integer passengers;

    private String description;

    private Double offeredPrice;

    private Boolean negotiable;

    private String status;

    private Double finalPrice;

    private LocalDateTime createdAt;
}