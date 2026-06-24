package one.oneride.service.impl;

import one.oneride.entity.OtpDetails;


import one.oneride.repository.OtpRepository;
import one.oneride.service.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OtpServiceImpl extends OtpService {

    private final OtpRepository otpRepository;

    @Override
    public void sendOtp(String phoneNumber) {

        String otp =
                String.valueOf(100000 + new Random().nextInt(900000));

        OtpDetails otpDetails =
                OtpDetails.builder()
                        .phoneNumber(phoneNumber)
                        .otp(otp)
                        .verified(false)
                        .expiryTime(LocalDateTime.now().plusMinutes(5))
                        .build();

        otpRepository.save(otpDetails);

        System.out.println(
                "OTP for " + phoneNumber + " : " + otp
        );
    }

    @Override
    public boolean verifyOtp(String phoneNumber,
                             String otp) {

        OtpDetails otpDetails =
                otpRepository
                        .findTopByPhoneNumberOrderByIdDesc(phoneNumber)
                        .orElse(null);

        if (otpDetails == null)
            return false;

        if (LocalDateTime.now()
                .isAfter(otpDetails.getExpiryTime()))
            return false;

        if (!otpDetails.getOtp().equals(otp))
            return false;

        otpDetails.setVerified(true);

        otpRepository.save(otpDetails);

        return true;
    }
}