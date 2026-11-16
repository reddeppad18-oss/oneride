
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

import one.oneride.enums.ChatMessageType;

@Entity
@Table(name = "chat_messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "conversation_id",
        nullable = false
    )
    private ChatConversation conversation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "sender_id",
        nullable = false
    )
    private User sender;

    @Column(
        nullable = false,
        length = 2000
    )
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(
        nullable = false,
        length = 20
    )
    @Builder.Default
    private ChatMessageType messageType =
            ChatMessageType.TEXT;

    @Column(nullable = false)
    private LocalDateTime sentAt;

    private LocalDateTime readAt;
}
