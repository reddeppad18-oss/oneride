
package one.oneride.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RequestResponseDto {

    // Response information
    private Long responseId;
    private Long requestId;
    private Long providerId;
    private String providerName;
    private String status;

    // Provider offer information
    private Double counterOffer;
    private Double finalPrice;
    private Long rentalListingId;

    // Customer request information
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
}
