package one.oneride.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateRatingRequest {

    private Long bookingId;

    private Integer rating;

    private String review;
}