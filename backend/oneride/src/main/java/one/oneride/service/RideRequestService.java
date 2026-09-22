package one.oneride.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import one.oneride.dto.*;
import one.oneride.entity.*;
import one.oneride.enums.*;
import one.oneride.repository.*;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RideRequestService {

    private static final double MATCH_RADIUS_KM = 10.0;

    private final RideRequestRepository
            rideRequestRepository;

    private final RideRequestResponseRepository
            responseRepository;

    private final UserRepository userRepository;

    private final ProviderLocationRepository
            providerLocationRepository;

    private final DriverVerificationRepository
            driverVerificationRepository;

    private final GeoDistanceService geoDistanceService;

    private final NotificationService notificationService;

    @Transactional
    public RideRequestDto createRequest(
            String phoneNumber,
            RideRequestCreateRequest request) {

        User customer = getUser(phoneNumber);

        RideRequest rideRequest =
                RideRequest.builder()
                        .customer(customer)
                        .pickupAddress(
                                request.getPickupAddress()
                        )
                        .pickupLatitude(
                                request.getPickupLatitude()
                        )
                        .pickupLongitude(
                                request.getPickupLongitude()
                        )
                        .destinationAddress(
                                request.getDestinationAddress()
                        )
                        .destinationLatitude(
                                request.getDestinationLatitude()
                        )
                        .destinationLongitude(
                                request.getDestinationLongitude()
                        )
                        .requestedSeats(
                                request.getRequestedSeats()
                        )
                        .offeredPrice(
                                request.getOfferedPrice()
                        )
                        .negotiable(
                                request.getNegotiable() == null
                                        || request.getNegotiable()
                                )
                        .status(
                                RideRequestStatus.SEARCHING
                        )
                        .createdAt(
                                LocalDateTime.now()
                        )
                        .expiresAt(
                                LocalDateTime.now()
                                        .plusMinutes(15)
                        )
                        .build();

        RideRequest saved =
                rideRequestRepository.save(
                        rideRequest
                );

        dispatchToNearbyProviders(saved);

        return mapRequest(saved);
    }

    @Transactional(readOnly = true)
    public List<RideRequestDto> getMyRequests(
            String phoneNumber) {

        User customer = getUser(phoneNumber);

        return rideRequestRepository
                .findByCustomerOrderByCreatedAtDesc(customer)
                .stream()
                .map(this::mapRequest)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<RequestResponseDto>
    getResponsesForRequest(
            String phoneNumber,
            Long requestId) {

        User customer = getUser(phoneNumber);

        RideRequest request =
                rideRequestRepository
                        .findById(requestId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Ride request not found"
                                )
                        );

        if (!request.getCustomer()
                .getId()
                .equals(customer.getId())) {

            throw new RuntimeException(
                    "Unauthorized"
            );
        }

        return responseRepository
                .findByRequest(request)
                .stream()
                .map(this::mapResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<RequestResponseDto>
    getProviderRequests(
            String phoneNumber) {

        User provider = getUser(phoneNumber);

        return responseRepository
                .findByProvider(provider)
                .stream()
                .map(this::mapResponse)
                .toList();
    }

    @Transactional
    public RequestResponseDto
    providerAction(
            String phoneNumber,
            Long responseId,
            RideRequestResponseAction action) {

        User provider = getUser(phoneNumber);

        RideRequestResponse response =
                responseRepository
                        .findByIdForUpdate(responseId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Ride request response not found"
                                )
                        );

        if (!response.getProvider()
                .getId()
                .equals(provider.getId())) {

            throw new RuntimeException(
                    "Unauthorized"
            );
        }

        RideRequest request =
                rideRequestRepository
                        .findByIdForUpdate(
                                response.getRequest().getId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Ride request not found"
                                )
                        );

        String actionName =
                action.getAction() == null
                        ? ""
                        : action.getAction()
                        .trim()
                        .toUpperCase();

        if ("REJECT".equals(actionName)) {

            response.setStatus(
                    RideRequestResponseStatus.REJECTED
            );

            response.setRespondedAt(
                    LocalDateTime.now()
            );

            responseRepository.save(response);

            notificationService.createNotification(
                    request.getCustomer(),
                    "Ride Request Rejected",
                    provider.getFullName()
                            + " rejected your ride request.",
                    NotificationType.GENERAL
            );

        } else if ("COUNTER".equals(actionName)) {

            if (!Boolean.TRUE.equals(
                    request.getNegotiable())) {

                throw new RuntimeException(
                        "This request is not negotiable"
                );
            }

            if (action.getCounterOffer() == null
                    || action.getCounterOffer() <= 0) {

                throw new RuntimeException(
                        "Counter offer must be greater than zero"
                );
            }

            response.setStatus(
                    RideRequestResponseStatus
                            .COUNTER_OFFERED
            );

            response.setCounterOffer(
                    action.getCounterOffer()
            );

            response.setRespondedAt(
                    LocalDateTime.now()
            );

            request.setStatus(
                    RideRequestStatus.COUNTER_OFFERED
            );

            responseRepository.save(response);
            rideRequestRepository.save(request);

            notificationService.createNotification(
                    request.getCustomer(),
                    "New Ride Counter-offer",
                    provider.getFullName()
                            + " offered ₹"
                            + action.getCounterOffer()
                            + " for your ride.",
                    NotificationType.GENERAL
            );

        } else if ("ACCEPT".equals(actionName)) {

            if (request.getStatus() ==
                    RideRequestStatus.ACCEPTED) {

                throw new RuntimeException(
                        "This ride request has already been accepted"
                );
            }

            Double finalPrice =
                    action.getCounterOffer() != null
                            ? action.getCounterOffer()
                            : request.getOfferedPrice();

            request.setFinalPrice(finalPrice);
            request.setStatus(
                    RideRequestStatus.ACCEPTED
            );

            response.setStatus(
                    RideRequestResponseStatus.ACCEPTED
            );

            response.setRespondedAt(
                    LocalDateTime.now()
            );

            responseRepository.save(response);
            rideRequestRepository.save(request);

            /*
             * Reject every other provider response.
             */
            List<RideRequestResponse> others =
                    responseRepository
                            .findByRequest(request);

            for (RideRequestResponse other :
                    others) {

                if (!other.getId()
                        .equals(response.getId())
                        && other.getStatus() !=
                        RideRequestResponseStatus.ACCEPTED) {

                    other.setStatus(
                            RideRequestResponseStatus.REJECTED
                    );

                    other.setRespondedAt(
                            LocalDateTime.now()
                    );
                }
            }

            responseRepository.saveAll(others);

            notificationService.createNotification(
                    request.getCustomer(),
                    "Ride Request Accepted",
                    provider.getFullName()
                            + " accepted your ride request for ₹"
                            + finalPrice
                            + ".",
                    NotificationType.GENERAL
            );

        } else {

            throw new RuntimeException(
                    "Action must be ACCEPT, REJECT or COUNTER"
            );
        }

        return mapResponse(response);
    }

    @Transactional
    public RequestResponseDto
    customerCounterAction(
            String phoneNumber,
            Long responseId,
            String action) {

        User customer = getUser(phoneNumber);

        RideRequestResponse response =
                responseRepository
                        .findByIdForUpdate(responseId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Response not found"
                                )
                        );

        RideRequest request =
                response.getRequest();

        if (!request.getCustomer()
                .getId()
                .equals(customer.getId())) {

            throw new RuntimeException(
                    "Unauthorized"
            );
        }

        if (response.getStatus() !=
                RideRequestResponseStatus.COUNTER_OFFERED) {

            throw new RuntimeException(
                    "No counter-offer is waiting"
            );
        }

        if ("ACCEPT".equalsIgnoreCase(action)) {

            request.setFinalPrice(
                    response.getCounterOffer()
            );

            request.setStatus(
                    RideRequestStatus.ACCEPTED
            );

            response.setStatus(
                    RideRequestResponseStatus.ACCEPTED
            );

            response.setRespondedAt(
                    LocalDateTime.now()
            );

            responseRepository.save(response);
            rideRequestRepository.save(request);

            List<RideRequestResponse> others =
                    responseRepository
                            .findByRequest(request);

            for (RideRequestResponse other :
                    others) {

                if (!other.getId()
                        .equals(response.getId())
                        && other.getStatus() !=
                        RideRequestResponseStatus.ACCEPTED) {

                    other.setStatus(
                            RideRequestResponseStatus.REJECTED
                    );
                }
            }

            responseRepository.saveAll(others);

            notificationService.createNotification(
                    response.getProvider(),
                    "Counter-offer Accepted",
                    customer.getFullName()
                            + " accepted your counter-offer.",
                    NotificationType.GENERAL
            );

        } else if ("REJECT".equalsIgnoreCase(action)) {

            response.setStatus(
                    RideRequestResponseStatus.REJECTED
            );

            response.setRespondedAt(
                    LocalDateTime.now()
            );

            responseRepository.save(response);

            request.setStatus(
                    RideRequestStatus.SEARCHING
            );

            rideRequestRepository.save(request);

            notificationService.createNotification(
                    response.getProvider(),
                    "Counter-offer Rejected",
                    customer.getFullName()
                            + " rejected your counter-offer.",
                    NotificationType.GENERAL
            );

        } else {

            throw new RuntimeException(
                    "Action must be ACCEPT or REJECT"
            );
        }

        return mapResponse(response);
    }

    private void dispatchToNearbyProviders(
            RideRequest request) {

        List<ProviderLocation> providers =
                providerLocationRepository
                        .findByAvailability(
                                ProviderAvailability.AVAILABLE
                        );

        for (ProviderLocation location :
                providers) {

            if (location.getUser()
                    .getId()
                    .equals(
                            request.getCustomer().getId()
                    )) {

                continue;
            }

            if (!isRideProvider(location)) {
                continue;
            }

            if (!isDriverEligible(location.getUser())) {
                continue;
            }

            if (location.getLastUpdatedAt() == null) {
                continue;
            }

            if (location.getLastUpdatedAt()
                    .isBefore(
                            LocalDateTime.now()
                                    .minusMinutes(5)
                    )) {

                continue;
            }

            double distance =
                    geoDistanceService.calculateDistanceKm(
                            request.getPickupLatitude(),
                            request.getPickupLongitude(),
                            location.getLatitude(),
                            location.getLongitude()
                    );

            if (distance > MATCH_RADIUS_KM) {
                continue;
            }

            if (responseRepository
                    .existsByRequestAndProvider(
                            request,
                            location.getUser()
                    )) {

                continue;
            }

            RideRequestResponse response =
                    RideRequestResponse.builder()
                            .request(request)
                            .provider(location.getUser())
                            .status(
                                    RideRequestResponseStatus.PENDING
                            )
                            .build();

            responseRepository.save(response);

            notificationService.createNotification(
                    location.getUser(),
                    "Nearby Ride Request",
                    "A customer nearby is requesting a ride for ₹"
                            + request.getOfferedPrice()
                            + ".",
                    NotificationType.GENERAL
            );
        }
    }

    private boolean isRideProvider(
            ProviderLocation location) {

        return location.getProviderType() ==
                ProviderType.RIDE
                || location.getProviderType() ==
                ProviderType.BOTH;
    }

    private boolean isDriverEligible(User user) {

        return driverVerificationRepository
                .findByUser(user)
                .map(v ->
                        v.getStatus() ==
                                DriverVerificationStatus.VERIFIED
                )
                .orElse(false);
    }

    private User getUser(String phoneNumber) {

        return userRepository
                .findByPhoneNumber(phoneNumber)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );
    }

    private RideRequestDto mapRequest(
            RideRequest request) {

        return RideRequestDto.builder()
                .id(request.getId())
                .customerId(
                        request.getCustomer().getId()
                )
                .customerName(
                        request.getCustomer().getFullName()
                )
                .pickupAddress(
                        request.getPickupAddress()
                )
                .pickupLatitude(
                        request.getPickupLatitude()
                )
                .pickupLongitude(
                        request.getPickupLongitude()
                )
                .destinationAddress(
                        request.getDestinationAddress()
                )
                .destinationLatitude(
                        request.getDestinationLatitude()
                )
                .destinationLongitude(
                        request.getDestinationLongitude()
                )
                .requestedSeats(
                        request.getRequestedSeats()
                )
                .offeredPrice(
                        request.getOfferedPrice()
                )
                .negotiable(
                        request.getNegotiable()
                )
                .status(
                        request.getStatus().name()
                )
                .finalPrice(
                        request.getFinalPrice()
                )
                .createdAt(
                        request.getCreatedAt()
                )
                .build();
    }

    private RequestResponseDto mapResponse(
            RideRequestResponse response) {

        return RequestResponseDto.builder()
                .responseId(response.getId())
                .requestId(
                        response.getRequest().getId()
                )
                .providerId(
                        response.getProvider().getId()
                )
                .providerName(
                        response.getProvider().getFullName()
                )
                .status(
                        response.getStatus().name()
                )
                .counterOffer(
                        response.getCounterOffer()
                )
                .finalPrice(
                        response.getRequest()
                                .getFinalPrice()
                )
                .build();
    }
}