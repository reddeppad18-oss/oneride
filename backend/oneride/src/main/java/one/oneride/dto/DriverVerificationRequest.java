package one.oneride.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DriverVerificationRequest {

    @NotBlank
    private String verificationReference;
}