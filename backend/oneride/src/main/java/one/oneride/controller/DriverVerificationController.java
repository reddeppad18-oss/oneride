package one.oneride.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import one.oneride.dto.DriverVerificationRequest;
import one.oneride.entity.DriverVerification;
import one.oneride.service.DriverVerificationService;

@RestController
@RequestMapping("/api/provider-verification")
@RequiredArgsConstructor
public class DriverVerificationController {

    private final DriverVerificationService
            driverVerificationService;

    @PostMapping
    public ResponseEntity<DriverVerification> submit(
            Authentication authentication,
            @Valid @RequestBody
            DriverVerificationRequest request) {

        return ResponseEntity.ok(
                driverVerificationService.submit(
                        authentication.getName(),
                        request
                )
        );
    }

    @GetMapping("/me")
    public ResponseEntity<DriverVerification> getMine(
            Authentication authentication) {

        return ResponseEntity.ok(
                driverVerificationService.getMyVerification(
                        authentication.getName()
                )
        );
    }
}