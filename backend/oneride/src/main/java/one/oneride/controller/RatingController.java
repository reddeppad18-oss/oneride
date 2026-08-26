package one.oneride.controller;

import lombok.RequiredArgsConstructor;
import one.oneride.dto.CreateRatingRequest;
import one.oneride.dto.RatingResponse;
import one.oneride.service.RatingService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
@CrossOrigin("*")
public class RatingController {

    private final RatingService ratingService;

    @PostMapping
    public RatingResponse createRating(
            Authentication authentication,
            @RequestBody CreateRatingRequest request) {

        return ratingService.createRating(
                authentication.getName(),
                request
        );
    }
}