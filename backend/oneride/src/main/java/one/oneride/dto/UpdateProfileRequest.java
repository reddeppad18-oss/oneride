package one.oneride.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProfileRequest {

    @NotBlank(message = "Name is required")
    @Size(
            max = 100,
            message = "Name cannot exceed 100 characters"
    )
    private String fullName;

    @Size(
            max = 100,
            message = "City cannot exceed 100 characters"
    )
    private String city;

    @Size(
            max = 500,
            message = "About me cannot exceed 500 characters"
    )
    private String aboutMe;

    private List<String> languages;

    /*
     * Profile photo URL
     */
    private String profilePhotoUrl;

    /*
     * Explicit getter and setter.
     * These ensure the methods are available even if
     * Lombok annotation processing is not working correctly.
     */
    public String getProfilePhotoUrl() {
        return profilePhotoUrl;
    }

    public void setProfilePhotoUrl(String profilePhotoUrl) {
        this.profilePhotoUrl = profilePhotoUrl;
    }
}

