package one.oneride.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RentalBookingResponse {


    private Long bookingId;


    private Long rentalId;


    private String vehicleType;


    private String brand;


    private String model;


    private String customerName;


    private String ownerName;


    private String startDate;


    private String endDate;


    private Integer totalDays;


    private Double totalAmount;


    private String bookingStatus;
}