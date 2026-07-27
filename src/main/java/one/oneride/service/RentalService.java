package one.oneride.service;

import one.oneride.dto.CreateRentalRequest;
import one.oneride.dto.RentalResponse;
import one.oneride.dto.MessageResponse;

import java.util.List;

public interface RentalService {


    // Owner creates a rental listing
    RentalResponse createRental(
            String phoneNumber,
            CreateRentalRequest request
    );


    // Owner views his/her listed vehicles
    List<RentalResponse> getMyRentals(
            String phoneNumber
    );


    // Search available rental vehicles
    List<RentalResponse> searchRentals(
            String location
    );


    // View rental details
    RentalResponse getRentalById(
            Long rentalId
    );


    // Owner updates availability
    MessageResponse updateRentalStatus(
            Long rentalId,
            String phoneNumber,
            String status
    );


    // Owner removes listing
    MessageResponse deleteRental(
            Long rentalId,
            String phoneNumber
    );
}