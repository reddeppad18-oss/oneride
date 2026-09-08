package one.oneride.service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.twilio.rest.verify.v2.service.Verification;
import com.twilio.rest.verify.v2.service.VerificationCheck;

import lombok.RequiredArgsConstructor;
import one.oneride.entity.User;
import one.oneride.service.OtpService;
import one.oneride.service.UserService;

@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService {

    private final UserService userService;

    @Value("${twilio.verify-service-sid}")
    private String serviceSid;

    @Override
    public void sendOtp(String phoneNumber) {

        try {

            Verification.creator(
                    serviceSid,
                    phoneNumber,
                    "sms"
            ).create();

            System.out.println(
                    "Twilio OTP sent to: " + phoneNumber
            );

        } catch (Exception e) {

            System.out.println(
                    "Twilio OTP send failed: "
                            + e.getMessage()
            );

            throw new RuntimeException(
                    "Failed to send OTP"
            );
        }
    }

    @Override
    public User verifyOtp(
            String phoneNumber,
            String otp) {

        try {

            VerificationCheck verificationCheck =
                    VerificationCheck.creator(serviceSid)
                            .setTo(phoneNumber)
                            .setCode(otp)
                            .create();

            System.out.println(
                    "Twilio verification status: "
                            + verificationCheck.getStatus()
            );

            if (!"approved".equals(
                    verificationCheck.getStatus()
            )) {
                return null;
            }

            return userService.createUserIfNotExists(
                    phoneNumber
            );

        } catch (Exception e) {

            System.out.println(
                    "Twilio OTP verification failed: "
                            + e.getMessage()
            );

            return null;
        }
    }
}