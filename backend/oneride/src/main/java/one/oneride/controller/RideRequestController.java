package one.oneride.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import one.oneride.dto.*;
import one.oneride.service.RideRequestService;

import java.util.List;

@RestController
@RequestMapping("/api/ride-requests")
@RequiredArgsConstructor
public class RideRequestController {

    private final RideRequestService rideRequestService;

    @PostMapping
    public ResponseEntity<RideRequestDto> create(
            Authentication authentication,
            @Valid @RequestBody
            RideRequestCreateRequest request) {

        return ResponseEntity.ok(
                rideRequestService.createRequest(
                        authentication.getName(),
                        request
                )
        );
    }

    @GetMapping("/my")
    public ResponseEntity<List<RideRequestDto>> myRequests(
            Authentication authentication) {

        return ResponseEntity.ok(
                rideRequestService.getMyRequests(
                        authentication.getName()
                )
        );
    }

    @GetMapping("/{requestId}/responses")
    public ResponseEntity<List<RequestResponseDto>>
    responses(
            Authentication authentication,
            @PathVariable Long requestId) {

        return ResponseEntity.ok(
                rideRequestService
                        .getResponsesForRequest(
                                authentication.getName(),
                                requestId
                        )
        );
    }

    @GetMapping("/provider")
    public ResponseEntity<List<RequestResponseDto>>
    providerRequests(
            Authentication authentication) {

        return ResponseEntity.ok(
                rideRequestService.getProviderRequests(
                        authentication.getName()
                )
        );
    }

    @PutMapping("/responses/{responseId}")
    public ResponseEntity<RequestResponseDto>
    providerAction(
            Authentication authentication,
            @PathVariable Long responseId,
            @Valid @RequestBody
            RideRequestResponseAction action) {

        return ResponseEntity.ok(
                rideRequestService.providerAction(
                        authentication.getName(),
                        responseId,
                        action
                )
        );
    }

    @PutMapping(
            "/responses/{responseId}/customer"
    )
    public ResponseEntity<RequestResponseDto>
    customerAction(
            Authentication authentication,
            @PathVariable Long responseId,
            @RequestParam String action) {

        return ResponseEntity.ok(
                rideRequestService.customerCounterAction(
                        authentication.getName(),
                        responseId,
                        action
                )
        );
    }
}