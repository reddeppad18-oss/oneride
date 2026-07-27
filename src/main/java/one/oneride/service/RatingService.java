package one.oneride.service;

import one.oneride.dto.CreateRatingRequest;
import one.oneride.dto.RatingResponse;

public interface RatingService {

    RatingResponse createRating(
            String phoneNumber,
            CreateRatingRequest request
    );
}