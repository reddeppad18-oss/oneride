package one.oneride.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "otp_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtpDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String phoneNumber;

    private String otp;

    private LocalDateTime expiryTime;

    private Boolean verified;
}