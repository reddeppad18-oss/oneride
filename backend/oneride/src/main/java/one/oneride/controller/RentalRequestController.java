package one.oneride.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import one.oneride.dto.*;
import one.oneride.service.RentalRequestService;

import java.util.List;

@RestController
@RequestMapping("/api/rental-requests")
@RequiredArgsConstructor
public class RentalRequestController {

    private final RentalRequestService rentalRequestService;

    @PostMapping
    public ResponseEntity<RentalRequestDto> create(
            Authentication authentication,
            @Valid @RequestBody
            RentalRequestCreateRequest request) {

        return ResponseEntity.ok(
                rentalRequestService.createRequest(
                        authentication.getName(),
                        request
                )
        );
    }

    @GetMapping("/my")
    public ResponseEntity<List<RentalRequestDto>>
    myRequests(
            Authentication authentication) {

        return ResponseEntity.ok(
                rentalRequestService.getMyRequests(
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
                rentalRequestService.getResponses(
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
                rentalRequestService.getProviderRequests(
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
            RentalRequestResponseAction action) {

        return ResponseEntity.ok(
                rentalRequestService.providerAction(
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
                rentalRequestService.customerCounterAction(
                        authentication.getName(),
                        responseId,
                        action
                )
        );
    }
}