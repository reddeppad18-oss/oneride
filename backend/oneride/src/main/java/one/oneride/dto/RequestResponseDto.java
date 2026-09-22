package one.oneride.dto;

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

    private Long responseId;

    private Long requestId;

    private Long providerId;

    private String providerName;

    private String status;

    private Double counterOffer;

    private Double finalPrice;

    private Long rentalListingId;
}