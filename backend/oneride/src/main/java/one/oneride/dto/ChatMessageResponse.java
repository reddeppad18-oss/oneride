
package one.oneride.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import one.oneride.enums.ChatMessageType;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageResponse {

    private Long messageId;

    private Long conversationId;

    private Long senderId;

    private String senderName;

    private String content;

    private ChatMessageType messageType;

    private LocalDateTime sentAt;

    private LocalDateTime readAt;
}
