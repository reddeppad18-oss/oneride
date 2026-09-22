package one.oneride.entity;

import jakarta.persistence.*;
import lombok.*;
import one.oneride.enums.RentalRequestResponseStatus;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "rental_request_responses",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_rental_request_provider",
                        columnNames = {
                                "request_id",
                                "provider_id"
                        }
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RentalRequestResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "request_id",
            nullable = false
    )
    private RentalRequest request;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "provider_id",
            nullable = false
    )
    private User provider;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rental_listing_id")
    private RentalListing rentalListing;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private RentalRequestResponseStatus status =
            RentalRequestResponseStatus.PENDING;

    private Double counterOffer;

    private LocalDateTime respondedAt;
}