package one.oneride.dto;

import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RentalRequestResponseAction {

    private String action;

    @PositiveOrZero
    private Double counterOffer;

    private Long rentalListingId;
}