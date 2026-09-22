package one.oneride.entity;

import jakarta.persistence.*;
import lombok.*;
import one.oneride.enums.ProviderAvailability;
import one.oneride.enums.ProviderType;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "provider_locations",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_provider_location_user",
                        columnNames = "user_id"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProviderLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "user_id",
            nullable = false,
            unique = true
    )
    private User user;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private ProviderAvailability availability =
            ProviderAvailability.OFFLINE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private ProviderType providerType =
            ProviderType.RIDE;

    @Column(nullable = false)
    private LocalDateTime lastUpdatedAt;
}