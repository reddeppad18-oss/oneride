package one.oneride.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class RentalRequestCreateRequest {

    @NotBlank
    private String vehicleType;

    @NotBlank
    @Size(max = 300)
    private String pickupAddress;

    @NotNull
    @DecimalMin("-90.0")
    @DecimalMax("90.0")
    private Double pickupLatitude;

    @NotNull
    @DecimalMin("-180.0")
    @DecimalMax("180.0")
    private Double pickupLongitude;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;

    @Min(1)
    private Integer passengers;

    @Size(max = 500)
    private String description;

    @NotNull
    @Positive
    private Double offeredPrice;

    private Boolean negotiable = true;
}