package one.oneride.service.impl;

import lombok.RequiredArgsConstructor;
import one.oneride.dto.CreateRentalRequest;
import one.oneride.dto.MessageResponse;
import one.oneride.dto.RentalResponse;
import one.oneride.entity.RentalListing;
import one.oneride.entity.User;
import one.oneride.enums.RentalStatus;
import one.oneride.repository.RentalRepository;
import one.oneride.repository.UserRepository;
import one.oneride.service.RentalService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RentalServiceImpl implements RentalService {


    private final RentalRepository rentalRepository;

    private final UserRepository userRepository;


    @Override
    public RentalResponse createRental(
            String phoneNumber,
            CreateRentalRequest request) {


        User owner = userRepository
                .findByPhoneNumber(phoneNumber)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));


        RentalListing rental = RentalListing.builder()
                .owner(owner)
                .vehicleType(request.getVehicleType())
                .brand(request.getBrand())
                .model(request.getModel())
                .registrationNumber(
                        request.getRegistrationNumber()
                )
                .seats(request.getSeats())
                .pricePerDay(request.getPricePerDay())
                .location(request.getLocation())
                .description(request.getDescription())
                .status(RentalStatus.AVAILABLE)
                .createdAt(LocalDateTime.now())
                .build();


        rentalRepository.save(rental);


        return mapToResponse(rental);
    }


    @Override
    public List<RentalResponse> getMyRentals(
            String phoneNumber) {


        User owner = userRepository
                .findByPhoneNumber(phoneNumber)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));


        return rentalRepository
                .findByOwner(owner)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    @Override
    public List<RentalResponse> searchRentals(
            String location) {


        return rentalRepository
                .findByLocationIgnoreCaseAndStatus(
                        location,
                        RentalStatus.AVAILABLE
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    @Override
    public RentalResponse getRentalById(
            Long rentalId) {


        RentalListing rental =
                rentalRepository.findById(rentalId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Rental not found"));


        return mapToResponse(rental);
    }


    @Override
    public MessageResponse updateRentalStatus(
            Long rentalId,
            String phoneNumber,
            String status) {


        RentalListing rental =
                rentalRepository.findById(rentalId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Rental not found"));


        if (!rental.getOwner()
                .getPhoneNumber()
                .equals(phoneNumber)) {

            throw new RuntimeException(
                    "Unauthorized");
        }


        rental.setStatus(
                RentalStatus.valueOf(status)
        );


        rentalRepository.save(rental);


        return MessageResponse.builder()
                .message(
                        "Rental status updated successfully"
                )
                .build();
    }


    @Override
    public MessageResponse deleteRental(
            Long rentalId,
            String phoneNumber) {


        RentalListing rental =
                rentalRepository.findById(rentalId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Rental not found"));


        if (!rental.getOwner()
                .getPhoneNumber()
                .equals(phoneNumber)) {

            throw new RuntimeException(
                    "Unauthorized");
        }


        rentalRepository.delete(rental);


        return MessageResponse.builder()
                .message(
                        "Rental deleted successfully"
                )
                .build();
    }


    private RentalResponse mapToResponse(
            RentalListing rental) {


        return RentalResponse.builder()
                .id(rental.getId())
                .ownerName(
                        rental.getOwner()
                                .getFullName()
                )
                .vehicleType(
                        rental.getVehicleType()
                )
                .brand(
                        rental.getBrand()
                )
                .model(
                        rental.getModel()
                )
                .registrationNumber(
                        rental.getRegistrationNumber()
                )
                .seats(
                        rental.getSeats()
                )
                .pricePerDay(
                        rental.getPricePerDay()
                )
                .location(
                        rental.getLocation()
                )
                .description(
                        rental.getDescription()
                )
                .status(
                        rental.getStatus().name()
                )
                .build();
    }
}