package one.oneride.entity;

import jakarta.persistence.*;
import lombok.*;
import one.oneride.enums.RentalStatus;

import java.time.LocalDateTime;

@Entity
@Table(name = "rental_listings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RentalListing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // Vehicle owner
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;


    private String vehicleType;

    private String brand;

    private String model;


    @Column(unique = true)
    private String registrationNumber;


    private Integer seats;


    private Double pricePerDay;


    private String location;


    @Column(length = 500)
    private String description;


    @Enumerated(EnumType.STRING)
    private RentalStatus status;


    private LocalDateTime createdAt;
}