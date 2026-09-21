package one.oneride.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import one.oneride.enums.NotificationType;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =========================================================
    // USER
    // =========================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "user_id",
            nullable = false
    )
    private User user;

    // =========================================================
    // TITLE
    // =========================================================

    @Column(
            nullable = false,
            length = 200
    )
    private String title;

    // =========================================================
    // MESSAGE
    // =========================================================

    @Column(
            nullable = false,
            length = 1000
    )
    private String message;

    // =========================================================
    // NOTIFICATION TYPE
    // =========================================================

    @Enumerated(EnumType.STRING)
    @Column(
            nullable = false,
            length = 50
    )
    private NotificationType type;

    // =========================================================
    // READ STATUS
    // =========================================================

    @Column(
            nullable = false
    )
    @Builder.Default
    private Boolean read = false;

    // =========================================================
    // CREATED TIME
    // =========================================================

    @Column(
            nullable = false
    )
    private LocalDateTime createdAt;
}