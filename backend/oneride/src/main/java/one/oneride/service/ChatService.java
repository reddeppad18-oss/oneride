
package one.oneride.service;


import java.util.List;

import org.springframework.data.domain.Page;

import one.oneride.entity.User;
import one.oneride.enums.ChatServiceType;
import one.oneride.dto.ChatConversationResponse;
import one.oneride.dto.ChatMessageResponse;
import one.oneride.dto.SendChatMessageRequest;
import one.oneride.enums.ChatServiceType;

public interface ChatService {

    // Create or retrieve a conversation for a service interaction
ChatConversationResponse getOrCreateConversation(
        ChatServiceType serviceType,
        Long serviceReferenceId,
        User customer,
        User provider
);
    // Get all conversations belonging to the authenticated user
    List<ChatConversationResponse> getMyConversations(
            String phoneNumber
    );

    // Get messages from a conversation
    Page<ChatMessageResponse> getMessages(
            Long conversationId,
            String phoneNumber,
            int page,
            int size
    );

    // Send a message
    ChatMessageResponse sendMessage(
            Long conversationId,
            String phoneNumber,
            SendChatMessageRequest request
    );

    // Mark incoming messages as read
    void markAsRead(
            Long conversationId,
            String phoneNumber
    );

    // Close a conversation
    void closeConversation(
            Long conversationId,
            String phoneNumber
    );
}
