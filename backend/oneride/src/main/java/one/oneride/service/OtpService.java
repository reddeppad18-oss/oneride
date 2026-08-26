package one.oneride.service;

import one.oneride.entity.User;

public interface OtpService {

    void sendOtp(String phoneNumber);

    User verifyOtp(String phoneNumber, String otp);
}