
package one.oneride.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import one.oneride.dto.ChatConversationResponse;
import one.oneride.dto.ChatMessageResponse;
import one.oneride.dto.SendChatMessageRequest;
import one.oneride.service.ChatService;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    // Get all conversations of the logged-in user
    @GetMapping("/conversations")
    public ResponseEntity<List<ChatConversationResponse>> getMyConversations(
            Authentication authentication) {

        return ResponseEntity.ok(
                chatService.getMyConversations(authentication.getName())
        );
    }

    // Get messages from a conversation
    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<Page<ChatMessageResponse>> getMessages(
            @PathVariable Long conversationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "30") int size,
            Authentication authentication) {

        return ResponseEntity.ok(
                chatService.getMessages(
                        conversationId,
                        authentication.getName(),
                        page,
                        size
                )
        );
    }

    // Send a text message
    @PostMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<ChatMessageResponse> sendMessage(
            @PathVariable Long conversationId,
            @Valid @RequestBody SendChatMessageRequest request,
            Authentication authentication) {

        ChatMessageResponse response = chatService.sendMessage(
                conversationId,
                authentication.getName(),
                request
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Mark received messages as read
    @PutMapping("/conversations/{conversationId}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long conversationId,
            Authentication authentication) {

        chatService.markAsRead(
                conversationId,
                authentication.getName()
        );

        return ResponseEntity.noContent().build();
    }

    // Close a conversation
    @PutMapping("/conversations/{conversationId}/close")
    public ResponseEntity<Void> closeConversation(
            @PathVariable Long conversationId,
            Authentication authentication) {

        chatService.closeConversation(
                conversationId,
                authentication.getName()
        );

        return ResponseEntity.noContent().build();
    }
}
