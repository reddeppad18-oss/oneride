package one.oneride.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class RatingResponse {

    private Long id;

    private Long bookingId;

    private Integer rating;

    private String review;

    private String reviewerName;

    private String revieweeName;
}