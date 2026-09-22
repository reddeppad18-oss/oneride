package one.oneride.entity;

import jakarta.persistence.*;
import lombok.*;
import one.oneride.enums.DriverVerificationStatus;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "driver_verifications",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_driver_verification_user",
                        columnNames = "user_id"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverVerification {

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

    /*
     * Do not store the complete driving licence image/number
     * unnecessarily.
     *
     * This field can contain a verification reference,
     * DigiLocker reference, or document verification ID.
     */
    @Column(length = 500)
    private String verificationReference;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private DriverVerificationStatus status =
            DriverVerificationStatus.NOT_SUBMITTED;

    private LocalDateTime submittedAt;

    private LocalDateTime verifiedAt;

    @Column(length = 500)
    private String rejectionReason;
}
