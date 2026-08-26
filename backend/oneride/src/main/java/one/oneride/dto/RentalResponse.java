package one.oneride.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RentalResponse {

    private Long id;

    private String ownerName;

    private String vehicleType;

    private String brand;

    private String model;

    private String registrationNumber;

    private Integer seats;

    private Double pricePerDay;

    private String location;

    private String description;

    private String status;
}