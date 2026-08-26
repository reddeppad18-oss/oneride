package one.oneride.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class CreateRideRequest {

    @NotBlank(message = "Source is required")
    private String source;

    @NotBlank(message = "Destination is required")
    private String destination;

    @NotNull(message = "Travel date is required")
    @FutureOrPresent(message = "Travel date cannot be in the past")
    private LocalDate travelDate;

    @NotNull(message = "Travel time is required")
    private LocalTime travelTime;

    @NotNull(message = "Available seats are required")
    @Min(value = 1, message = "Seats must be at least 1")
    private Integer availableSeats;

    @NotNull(message = "Price per seat is required")
    @Positive(message = "Price must be greater than zero")
    private Double pricePerSeat;

    @NotBlank(message = "Vehicle type is required")
    private String vehicleType;

    @NotBlank(message = "Brand is required")
    private String brand;

    @NotBlank(message = "Registration number is required")
    private String registrationNumber;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

}
