package one.oneride.controller;

import one.oneride.dto.SendOtpRequest;
import one.oneride.dto.VerifyOtpRequest;
import one.oneride.service.OtpService;
import lombok.RequiredArgsConstructor;
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
                request.getPhoneNumber());

        return "OTP Sent";
    }

    @PostMapping("/verify-otp")
    public String verifyOtp(
            @RequestBody VerifyOtpRequest request) {

        boolean verified =
                otpService.verifyOtp(
                        request.getPhoneNumber(),
                        request.getOtp());

        return verified
                ? "OTP Verified"
                : "Invalid OTP";
    }
}