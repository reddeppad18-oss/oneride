package one.oneride.controller;

import lombok.RequiredArgsConstructor;
import one.oneride.dto.AuthResponse;
import one.oneride.dto.SendOtpRequest;
import one.oneride.dto.VerifyOtpRequest;
import one.oneride.service.AuthService;
import one.oneride.service.OtpService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthController {

    private final OtpService otpService;
    private final AuthService authService;

    @PostMapping("/send-otp")
    public String sendOtp(
            @RequestBody SendOtpRequest request) {

        otpService.sendOtp(
                request.getPhoneNumber()
        );

        return "OTP Sent";
    }

    @PostMapping("/verify-otp")
    public AuthResponse verifyOtp(
            @RequestBody VerifyOtpRequest request) {

        return authService.verifyOtp(
                request.getPhoneNumber(),
                request.getOtp()
        );
    }
    @GetMapping("/test")
    public String test() {
        return "Working";
    }
}