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
public class RentalRequestService {

    private static final double MATCH_RADIUS_KM = 10.0;

    private final RentalRequestRepository
            rentalRequestRepository;

    private final RentalRequestResponseRepository
            responseRepository;

    private final RentalListingRepository
            rentalListingRepository;

    private final ProviderLocationRepository
            providerLocationRepository;

    private final UserRepository userRepository;

    private final NotificationService notificationService;

    private final GeoDistanceService geoDistanceService;

    @Transactional
    public RentalRequestDto createRequest(
            String phoneNumber,
            RentalRequestCreateRequest request) {

        User customer = getUser(phoneNumber);

        if (request.getEndDate()
                .isBefore(request.getStartDate())) {

            throw new RuntimeException(
                    "End date cannot be before start date"
            );
        }

        RentalRequest rentalRequest =
                RentalRequest.builder()
                        .customer(customer)
                        .vehicleType(
                                request.getVehicleType()
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
                        .startDate(
                                request.getStartDate()
                        )
                        .endDate(
                                request.getEndDate()
                        )
                        .passengers(
                                request.getPassengers()
                        )
                        .description(
                                request.getDescription()
                        )
                        .offeredPrice(
                                request.getOfferedPrice()
                        )
                        .negotiable(
                                request.getNegotiable() == null
                                        || request.getNegotiable()
                                )
                        .status(
                                RentalRequestStatus.SEARCHING
                        )
                        .createdAt(
                                LocalDateTime.now()
                        )
                        .expiresAt(
                                LocalDateTime.now()
                                        .plusHours(1)
                        )
                        .build();

        RentalRequest saved =
                rentalRequestRepository.save(
                        rentalRequest
                );

        dispatchToNearbyProviders(saved);

        return mapRequest(saved);
    }

    @Transactional(readOnly = true)
    public List<RentalRequestDto> getMyRequests(
            String phoneNumber) {

        User customer = getUser(phoneNumber);

        return rentalRequestRepository
                .findByCustomerOrderByCreatedAtDesc(customer)
                .stream()
                .map(this::mapRequest)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<RequestResponseDto>
    getResponses(
            String phoneNumber,
            Long requestId) {

        User customer = getUser(phoneNumber);

        RentalRequest request =
                rentalRequestRepository
                        .findById(requestId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Rental request not found"
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
    public RequestResponseDto providerAction(
            String phoneNumber,
            Long responseId,
            RentalRequestResponseAction action) {

        User provider = getUser(phoneNumber);

        RentalRequestResponse response =
                responseRepository
                        .findByIdForUpdate(responseId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Rental response not found"
                                )
                        );

        if (!response.getProvider()
                .getId()
                .equals(provider.getId())) {

            throw new RuntimeException(
                    "Unauthorized"
            );
        }

        RentalRequest request =
                rentalRequestRepository
                        .findByIdForUpdate(
                                response.getRequest().getId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Rental request not found"
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
                    RentalRequestResponseStatus.REJECTED
            );

            response.setRespondedAt(
                    LocalDateTime.now()
            );

            responseRepository.save(response);

            notificationService.createNotification(
                    request.getCustomer(),
                    "Rental Request Rejected",
                    provider.getFullName()
                            + " rejected your rental request.",
                    NotificationType.GENERAL
            );

        } else if ("COUNTER".equals(actionName)) {

            if (!Boolean.TRUE.equals(
                    request.getNegotiable())) {

                throw new RuntimeException(
                        "This rental request is not negotiable"
                );
            }

            if (action.getCounterOffer() == null
                    || action.getCounterOffer() <= 0) {

                throw new RuntimeException(
                        "Counter offer must be greater than zero"
                );
            }

            response.setStatus(
                    RentalRequestResponseStatus
                            .COUNTER_OFFERED
            );

            response.setCounterOffer(
                    action.getCounterOffer()
            );

            response.setRespondedAt(
                    LocalDateTime.now()
            );

            request.setStatus(
                    RentalRequestStatus.COUNTER_OFFERED
            );

            responseRepository.save(response);
            rentalRequestRepository.save(request);

            notificationService.createNotification(
                    request.getCustomer(),
                    "Rental Counter-offer",
                    provider.getFullName()
                            + " offered ₹"
                            + action.getCounterOffer()
                            + " for your rental request.",
                    NotificationType.GENERAL
            );

        } else if ("ACCEPT".equals(actionName)) {

            if (request.getStatus() ==
                    RentalRequestStatus.ACCEPTED) {

                throw new RuntimeException(
                        "Rental request already accepted"
                );
            }

            if (action.getRentalListingId() == null) {

                throw new RuntimeException(
                        "Rental listing is required"
                );
            }

            RentalListing listing =
                    rentalListingRepository
                            .findById(
                                    action.getRentalListingId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Rental listing not found"
                                    )
                            );

            if (!listing.getOwner()
                    .getId()
                    .equals(provider.getId())) {

                throw new RuntimeException(
                        "Rental listing does not belong to provider"
                );
            }

            Double finalPrice =
                    action.getCounterOffer() != null
                            ? action.getCounterOffer()
                            : request.getOfferedPrice();

            response.setRentalListing(listing);
            response.setStatus(
                    RentalRequestResponseStatus.ACCEPTED
            );
            response.setRespondedAt(
                    LocalDateTime.now()
            );

            request.setFinalPrice(finalPrice);
            request.setStatus(
                    RentalRequestStatus.ACCEPTED
            );

            responseRepository.save(response);
            rentalRequestRepository.save(request);

            List<RentalRequestResponse> others =
                    responseRepository
                            .findByRequest(request);

            for (RentalRequestResponse other :
                    others) {

                if (!other.getId()
                        .equals(response.getId())
                        && other.getStatus() !=
                        RentalRequestResponseStatus.ACCEPTED) {

                    other.setStatus(
                            RentalRequestResponseStatus.REJECTED
                    );
                }
            }

            responseRepository.saveAll(others);

            notificationService.createNotification(
                    request.getCustomer(),
                    "Rental Request Accepted",
                    provider.getFullName()
                            + " accepted your rental request for ₹"
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
    public RequestResponseDto customerCounterAction(
            String phoneNumber,
            Long responseId,
            String action) {

        User customer = getUser(phoneNumber);

        RentalRequestResponse response =
                responseRepository
                        .findByIdForUpdate(responseId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Response not found"
                                )
                        );

        RentalRequest request =
                response.getRequest();

        if (!request.getCustomer()
                .getId()
                .equals(customer.getId())) {

            throw new RuntimeException(
                    "Unauthorized"
            );
        }

        if (response.getStatus() !=
                RentalRequestResponseStatus.COUNTER_OFFERED) {

            throw new RuntimeException(
                    "No counter-offer is waiting"
            );
        }

        if ("ACCEPT".equalsIgnoreCase(action)) {

            request.setFinalPrice(
                    response.getCounterOffer()
            );

            request.setStatus(
                    RentalRequestStatus.ACCEPTED
            );

            response.setStatus(
                    RentalRequestResponseStatus.ACCEPTED
            );

            response.setRespondedAt(
                    LocalDateTime.now()
            );

            responseRepository.save(response);
            rentalRequestRepository.save(request);

            notificationService.createNotification(
                    response.getProvider(),
                    "Counter-offer Accepted",
                    customer.getFullName()
                            + " accepted your counter-offer.",
                    NotificationType.GENERAL
            );

        } else if ("REJECT".equalsIgnoreCase(action)) {

            response.setStatus(
                    RentalRequestResponseStatus.REJECTED
            );

            response.setRespondedAt(
                    LocalDateTime.now()
            );

            responseRepository.save(response);

            request.setStatus(
                    RentalRequestStatus.SEARCHING
            );

            rentalRequestRepository.save(request);

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
            RentalRequest request) {

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

            if (!isRentalProvider(location)) {
                continue;
            }

            if (location.getLastUpdatedAt() == null) {
                continue;
            }

            if (location.getLastUpdatedAt()
                    .isBefore(
                            LocalDateTime.now()
                                    .minusMinutes(30)
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

            List<RentalListing> listings =
                    rentalListingRepository
                            .findByOwner(
                                    location.getUser()
                            );

            boolean hasMatchingVehicle =
                    listings.stream()
                            .anyMatch(listing ->
                                    listing.getVehicleType()
                                            .equalsIgnoreCase(
                                                    request.getVehicleType()
                                            ));

            if (!hasMatchingVehicle) {
                continue;
            }

            RentalRequestResponse response =
                    RentalRequestResponse.builder()
                            .request(request)
                            .provider(location.getUser())
                            .status(
                                    RentalRequestResponseStatus.PENDING
                            )
                            .build();

            responseRepository.save(response);

            notificationService.createNotification(
                    location.getUser(),
                    "Nearby Rental Request",
                    "A customer nearby is requesting a "
                            + request.getVehicleType()
                            + " for ₹"
                            + request.getOfferedPrice()
                            + ".",
                    NotificationType.GENERAL
            );
        }
    }

    private boolean isRentalProvider(
            ProviderLocation location) {

        return location.getProviderType() ==
                ProviderType.RENTAL
                || location.getProviderType() ==
                ProviderType.BOTH;
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

    private RentalRequestDto mapRequest(
            RentalRequest request) {

        return RentalRequestDto.builder()
                .id(request.getId())
                .customerId(
                        request.getCustomer().getId()
                )
                .customerName(
                        request.getCustomer().getFullName()
                )
                .vehicleType(
                        request.getVehicleType()
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
                .startDate(
                        request.getStartDate()
                )
                .endDate(
                        request.getEndDate()
                )
                .passengers(
                        request.getPassengers()
                )
                .description(
                        request.getDescription()
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
            RentalRequestResponse response) {

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
                .rentalListingId(
                        response.getRentalListing() == null
                                ? null
                                : response.getRentalListing()
                                .getId()
                )
                .build();
    }
}