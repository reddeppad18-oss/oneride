
package one.oneride.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import one.oneride.enums.ChatConversationStatus;
import one.oneride.enums.ChatServiceType;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatConversationResponse {

    private Long conversationId;

    private ChatServiceType serviceType;

    private Long serviceReferenceId;

    private Long customerId;

    private String customerName;

    private Long providerId;

    private String providerName;

    private ChatConversationStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime lastMessageAt;

    private long unreadCount;
}
