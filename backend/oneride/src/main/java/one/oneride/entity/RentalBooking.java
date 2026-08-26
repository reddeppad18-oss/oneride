package one.oneride.entity;

import jakarta.persistence.*;
import lombok.*;
import one.oneride.enums.RentalBookingStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "rental_bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RentalBooking {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // Vehicle being rented
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rental_id", nullable = false)
    private RentalListing rentalListing;


    // Customer who booked
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;


    private LocalDate startDate;


    private LocalDate endDate;


    private Integer totalDays;


    private Double totalAmount;


    @Enumerated(EnumType.STRING)
    private RentalBookingStatus status;


    private LocalDateTime createdAt;
}