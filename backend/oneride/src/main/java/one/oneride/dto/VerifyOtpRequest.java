package one.oneride.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifyOtpRequest {

    private String phoneNumber;
    private String otp;
}