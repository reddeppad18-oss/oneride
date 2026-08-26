package one.oneride.service.impl;

import lombok.RequiredArgsConstructor;
import one.oneride.entity.OtpDetails;
import one.oneride.entity.User;
import one.oneride.repository.OtpRepository;
import one.oneride.service.OtpService;
import one.oneride.service.UserService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService {

    private final OtpRepository otpRepository;
    private final UserService userService;

    @Override
    public void sendOtp(String phoneNumber) {

        String otp =
                String.valueOf(
                        100000 + new Random().nextInt(900000)
                );

        OtpDetails otpDetails = OtpDetails.builder()
                .phoneNumber(phoneNumber)
                .otp(otp)
                .verified(false)
                .expiryTime(
                        LocalDateTime.now().plusMinutes(5)
                )
                .build();

        otpRepository.save(otpDetails);

        System.out.println(
                "OTP for " + phoneNumber + " : " + otp
        );
    }

    @Override
    public User verifyOtp(
            String phoneNumber,
            String otp) {

        OtpDetails otpDetails =
                otpRepository
                        .findTopByPhoneNumberOrderByIdDesc(
                                phoneNumber
                        )
                        .orElse(null);

        if (otpDetails == null) {
            return null;
        }

        if (LocalDateTime.now()
                .isAfter(
                        otpDetails.getExpiryTime()
                )) {
            return null;
        }

        if (!otpDetails.getOtp().equals(otp)) {
            return null;
        }

        otpDetails.setVerified(true);

        otpRepository.save(otpDetails);

        return userService
                .createUserIfNotExists(
                        phoneNumber
                );
    }
}