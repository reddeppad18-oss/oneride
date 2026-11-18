
package one.oneride.service;

import java.util.List;

import org.springframework.data.domain.Page;

import one.oneride.entity.User;
import one.oneride.enums.ChatServiceType;
import one.oneride.dto.ChatConversationResponse;
import one.oneride.dto.ChatMessageResponse;
import one.oneride.dto.SendChatMessageRequest;

public interface ChatService {

    ChatConversationResponse getOrCreateConversation(
            ChatServiceType serviceType,
            Long serviceReferenceId,
            User customer,
            User provider
    );

    List<ChatConversationResponse> getMyConversations(
            String phoneNumber
    );

    Page<ChatMessageResponse> getMessages(
            Long conversationId,
            String phoneNumber,
            int page,
            int size
    );

    ChatMessageResponse sendMessage(
            Long conversationId,
            String phoneNumber,
            SendChatMessageRequest request
    );

    ChatMessageResponse editMessage(
            Long conversationId,
            Long messageId,
            String phoneNumber,
            SendChatMessageRequest request
    );

    void deleteMessage(
            Long conversationId,
            Long messageId,
            String phoneNumber,
            boolean forEveryone
    );

    void deleteConversation(
            Long conversationId,
            String phoneNumber
    );

    void markAsRead(
            Long conversationId,
            String phoneNumber
    );

    void closeConversation(
            Long conversationId,
            String phoneNumber
    );
}
