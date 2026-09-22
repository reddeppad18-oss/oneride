package one.oneride.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import one.oneride.dto.AvailabilityRequest;
import one.oneride.dto.UpdateProviderLocationRequest;
import one.oneride.entity.ProviderLocation;
import one.oneride.service.ProviderLocationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/provider-location")
@RequiredArgsConstructor
public class ProviderLocationController {

    private final ProviderLocationService providerLocationService;

    @PutMapping
    public ResponseEntity<ProviderLocation> updateLocation(
            Authentication authentication,
            @Valid @RequestBody UpdateProviderLocationRequest request) {

        String phoneNumber = authentication.getName();

        return ResponseEntity.ok(
                providerLocationService.updateLocation(phoneNumber, request)
        );
    }

    @GetMapping
    public ResponseEntity<ProviderLocation> getMyLocation(
            Authentication authentication) {

        String phoneNumber = authentication.getName();

        return ResponseEntity.ok(
                providerLocationService.getMyLocation(phoneNumber)
        );
    }

    @PutMapping("/availability")
    public ResponseEntity<ProviderLocation> updateAvailability(
            Authentication authentication,
            @Valid @RequestBody AvailabilityRequest request) {

        String phoneNumber = authentication.getName();

        return ResponseEntity.ok(
                providerLocationService.updateAvailability(phoneNumber, request)
        );
    }
}