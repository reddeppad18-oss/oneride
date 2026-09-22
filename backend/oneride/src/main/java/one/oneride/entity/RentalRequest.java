package one.oneride.entity;

import jakarta.persistence.*;
import lombok.*;
import one.oneride.enums.RentalRequestStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "rental_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RentalRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @Column(nullable = false, length = 50)
    private String vehicleType;

    @Column(nullable = false, length = 300)
    private String pickupAddress;

    @Column(nullable = false)
    private Double pickupLatitude;

    @Column(nullable = false)
    private Double pickupLongitude;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    private Integer passengers;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private Double offeredPrice;

    @Column(nullable = false)
    @Builder.Default
    private Boolean negotiable = true;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private RentalRequestStatus status =
            RentalRequestStatus.SEARCHING;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime expiresAt;

    private Double finalPrice;
}