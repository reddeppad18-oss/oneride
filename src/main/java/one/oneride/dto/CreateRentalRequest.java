package one.oneride.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class CreateRentalRequest {

    @NotBlank(message = "Vehicle type is required")
    private String vehicleType;

    @NotBlank(message = "Brand is required")
    private String brand;

    @NotBlank(message = "Model is required")
    private String vehicleModel;

    @NotBlank(message = "Registration number is required")
    private String vehicleNumber;

    @NotNull(message = "Seats are required")
    @Min(value = 1, message = "Seats must be at least 1")
    private Integer seats;

    @NotNull(message = "Price per day is required")
    @Positive(message = "Price per day must be greater than zero")
    private Double pricePerDay;

    @NotBlank(message = "Location is required")
    private String location;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;


    // Custom getters
    public String getModel() {
        return vehicleModel;
    }

    public String getRegistrationNumber() {
        return vehicleNumber;
    }
}