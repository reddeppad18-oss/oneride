package one.oneride.entity;

import jakarta.persistence.*;
import lombok.*;
import one.oneride.enums.RideRequestResponseStatus;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "ride_request_responses",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_ride_request_provider",
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
public class RideRequestResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "request_id",
            nullable = false
    )
    private RideRequest request;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "provider_id",
            nullable = false
    )
    private User provider;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private RideRequestResponseStatus status =
            RideRequestResponseStatus.PENDING;

    private Double counterOffer;

    private LocalDateTime respondedAt;
}