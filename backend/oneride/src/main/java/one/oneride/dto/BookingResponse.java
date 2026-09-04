package one.oneride.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BookingResponse {

    private Long bookingId;

    private Long rideId;

    private String source;

    private String destination;

    private String rideOwnerName;

    private String passengerName;

    private String travelDate;

    private String travelTime;

    private Integer seatsBooked;

    private Double pricePerSeat;

    private Double totalAmount;

    private String bookingStatus;

    // Vehicle details
    private String vehicleType;

    private String brand;

    private String registrationNumber;
}