package one.oneride.service;

public abstract class OtpService {
    public abstract void sendOtp(String phoneNumber);

    public abstract boolean verifyOtp(String phoneNumber,
                                      String otp);
}
