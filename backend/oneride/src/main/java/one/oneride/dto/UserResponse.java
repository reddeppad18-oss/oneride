package one.oneride.dto;

import java.util.List;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class UserResponse {

    private Long id;

    private String fullName;

    private String phoneNumber;

    private String role;

    private Boolean verified;

    private String city;

    private String aboutMe;

    private Double averageRating;

    private Long totalRatings;

    private List<String> languages;

    private String profilePhotoUrl;
}

