package one.oneride.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RideRequestCreateRequest {

    @NotBlank
    private String pickupAddress;

    @NotNull
    private Double pickupLatitude;

    @NotNull
    private Double pickupLongitude;

    @NotBlank
    private String destinationAddress;

    @NotNull
    private Double destinationLatitude;

    @NotNull
    private Double destinationLongitude;

    @NotNull
    @Min(1)
    private Integer requestedSeats;

    @NotNull
    @DecimalMin("0.0")
    private Double offeredPrice;

    private Boolean negotiable;
}