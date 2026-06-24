package one.oneride.controller;

import lombok.RequiredArgsConstructor;
import one.oneride.dto.SendOtpRequest;
import one.oneride.dto.VerifyOtpRequest;
import one.oneride.entity.User;
import one.oneride.service.OtpService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthController {

    private final OtpService otpService;

    @PostMapping("/send-otp")
    public String sendOtp(
            @RequestBody SendOtpRequest request) {

        otpService.sendOtp(
                request.getPhoneNumber()
        );

        return "OTP Sent";
    }

    @PostMapping("/verify-otp")
    public String verifyOtp(
            @RequestBody VerifyOtpRequest request) {

        User user =
                otpService.verifyOtp(
                        request.getPhoneNumber(),
                        request.getOtp()
                );

        if (user == null) {
            return "Invalid OTP";
        }

        return "OTP Verified";
    }
}