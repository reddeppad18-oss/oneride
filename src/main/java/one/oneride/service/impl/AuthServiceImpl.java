package one.oneride.service.impl;

import lombok.RequiredArgsConstructor;
import one.oneride.dto.AuthResponse;
import one.oneride.entity.User;
import one.oneride.security.JwtService;
import one.oneride.service.AuthService;
import one.oneride.service.OtpService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final OtpService otpService;
    private final JwtService jwtService;

    @Override
    public AuthResponse verifyOtp(String phoneNumber, String otp) {

        User user = otpService.verifyOtp(phoneNumber, otp);

        if (user == null) {
            return AuthResponse.builder()
                    .message("Invalid OTP")
                    .token(null)
                    .build();
        }

        String token = jwtService.generateToken(user);

        return AuthResponse.builder()
                .message("OTP Verified")
                .token(token)
                .build();
    }
}