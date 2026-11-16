
package one.oneride.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import one.oneride.dto.ChatConversationResponse;
import one.oneride.dto.ChatMessageResponse;
import one.oneride.dto.SendChatMessageRequest;
import one.oneride.entity.ChatConversation;
import one.oneride.entity.ChatMessage;
import one.oneride.entity.User;
import one.oneride.enums.ChatConversationStatus;
import one.oneride.enums.ChatMessageType;
import one.oneride.enums.ChatServiceType;
import one.oneride.repository.ChatConversationRepository;
import one.oneride.repository.ChatMessageRepository;
import one.oneride.repository.UserRepository;
import one.oneride.service.ChatService;

@Service
@RequiredArgsConstructor
@Transactional
public class ChatServiceImpl implements ChatService {

    private final ChatConversationRepository conversationRepository;
    private final ChatMessageRepository messageRepository;
    private final UserRepository userRepository;

    @Override
    public ChatConversationResponse getOrCreateConversation(
            ChatServiceType serviceType,
            Long serviceReferenceId,
            User customer,
            User provider) {

        if (serviceType == null || serviceReferenceId == null
                || customer == null || provider == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Chat details are required"
            );
        }

        if (Objects.equals(customer.getId(), provider.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "You cannot create a chat with yourself"
            );
        }

        ChatConversation conversation = conversationRepository
                .findByServiceTypeAndServiceReferenceIdAndCustomerAndProvider(
                        serviceType,
                        serviceReferenceId,
                        customer,
                        provider
                )
                .orElseGet(() -> {
                    ChatConversation newConversation = ChatConversation.builder()
                            .serviceType(serviceType)
                            .serviceReferenceId(serviceReferenceId)
                            .customer(customer)
                            .provider(provider)
                            .status(ChatConversationStatus.ACTIVE)
                            .createdAt(LocalDateTime.now())
                            .build();

                    return conversationRepository.save(newConversation);
                });

        return mapConversation(conversation, customer);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChatConversationResponse> getMyConversations(String phoneNumber) {

        User user = getUser(phoneNumber);

        return conversationRepository
                .findByCustomerOrProviderOrderByLastMessageAtDesc(user, user)
                .stream()
                .map(conversation -> mapConversation(conversation, user))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ChatMessageResponse> getMessages(
            Long conversationId,
            String phoneNumber,
            int page,
            int size) {

        if (page < 0 || size < 1 || size > 100) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid page or page size"
            );
        }

        User user = getUser(phoneNumber);
        ChatConversation conversation = getConversation(conversationId);

        verifyParticipant(conversation, user);

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "sentAt")
        );

        return messageRepository
                .findByConversationOrderBySentAtDesc(conversation, pageable)
                .map(this::mapMessage);
    }

    @Override
    public ChatMessageResponse sendMessage(
            Long conversationId,
            String phoneNumber,
            SendChatMessageRequest request) {

        User user = getUser(phoneNumber);
        ChatConversation conversation = getConversation(conversationId);

        verifyParticipant(conversation, user);

        if (conversation.getStatus() != ChatConversationStatus.ACTIVE) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "This conversation is closed"
            );
        }

        if (request == null || request.getContent() == null
                || request.getContent().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Message cannot be empty"
            );
        }

        String content = request.getContent().trim();

        if (content.length() > 2000) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Message cannot exceed 2000 characters"
            );
        }

        LocalDateTime now = LocalDateTime.now();

        ChatMessage message = ChatMessage.builder()
                .conversation(conversation)
                .sender(user)
                .content(content)
                .messageType(ChatMessageType.TEXT)
                .sentAt(now)
                .build();

        ChatMessage savedMessage = messageRepository.save(message);

        conversation.setLastMessageAt(now);
        conversationRepository.save(conversation);

        return mapMessage(savedMessage);
    }

    @Override
    public void markAsRead(Long conversationId, String phoneNumber) {

        User user = getUser(phoneNumber);
        ChatConversation conversation = getConversation(conversationId);

        verifyParticipant(conversation, user);

        messageRepository.markMessagesAsRead(conversation, user);
    }

    @Override
    public void closeConversation(Long conversationId, String phoneNumber) {

        User user = getUser(phoneNumber);
        ChatConversation conversation = getConversation(conversationId);

        verifyParticipant(conversation, user);

        conversation.setStatus(ChatConversationStatus.CLOSED);
        conversationRepository.save(conversation);
    }

    private User getUser(String phoneNumber) {
        return userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));
    }

    private ChatConversation getConversation(Long conversationId) {
        return conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Conversation not found"
                ));
    }

    private void verifyParticipant(
            ChatConversation conversation,
            User user) {

        boolean isCustomer = Objects.equals(
                conversation.getCustomer().getId(),
                user.getId()
        );

        boolean isProvider = Objects.equals(
                conversation.getProvider().getId(),
                user.getId()
        );

        if (!isCustomer && !isProvider) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You are not a participant in this conversation"
            );
        }
    }

    private ChatConversationResponse mapConversation(
            ChatConversation conversation,
            User currentUser) {

        long unreadCount = messageRepository
                .countByConversationAndSenderNotAndReadAtIsNull(
                        conversation,
                        currentUser
                );

        return ChatConversationResponse.builder()
                .conversationId(conversation.getId())
                .serviceType(conversation.getServiceType())
                .serviceReferenceId(conversation.getServiceReferenceId())
                .customerId(conversation.getCustomer().getId())
                .customerName(conversation.getCustomer().getFullName())
                .providerId(conversation.getProvider().getId())
                .providerName(conversation.getProvider().getFullName())
                .status(conversation.getStatus())
                .createdAt(conversation.getCreatedAt())
                .lastMessageAt(conversation.getLastMessageAt())
                .unreadCount(unreadCount)
                .build();
    }

    private ChatMessageResponse mapMessage(ChatMessage message) {

        return ChatMessageResponse.builder()
                .messageId(message.getId())
                .conversationId(message.getConversation().getId())
                .senderId(message.getSender().getId())
                .senderName(message.getSender().getFullName())
                .content(message.getContent())
                .messageType(message.getMessageType())
                .sentAt(message.getSentAt())
                .readAt(message.getReadAt())
                .build();
    }
}
