
package one.oneride.entity;

import jakarta.persistence.*;
import lombok.*;

import one.oneride.enums.ChatServiceType;
import one.oneride.enums.ChatConversationStatus;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "chat_conversations",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_chat_service_participants",
            columnNames = {
                "service_type",
                "service_reference_id",
                "customer_id",
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
public class ChatConversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "service_type", nullable = false)
    private ChatServiceType serviceType;

    @Column(name = "service_reference_id", nullable = false)
    private Long serviceReferenceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_id", nullable = false)
    private User provider;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ChatConversationStatus status = ChatConversationStatus.ACTIVE;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime lastMessageAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }

        if (status == null) {
            status = ChatConversationStatus.ACTIVE;
        }
    }
}
