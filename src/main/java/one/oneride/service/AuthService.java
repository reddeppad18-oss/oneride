package one.oneride.service;

import one.oneride.dto.AuthResponse;

public interface AuthService {

    AuthResponse verifyOtp(
            String phoneNumber,
            String otp
    );
}