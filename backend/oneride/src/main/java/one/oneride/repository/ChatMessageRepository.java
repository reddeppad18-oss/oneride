
package one.oneride.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import one.oneride.entity.ChatConversation;
import one.oneride.entity.ChatMessage;
import one.oneride.entity.User;

public interface ChatMessageRepository
        extends JpaRepository<ChatMessage, Long> {

    Page<ChatMessage> findByConversationOrderBySentAtDesc(
            ChatConversation conversation,
            Pageable pageable
    );

    List<ChatMessage> findByConversationOrderBySentAtAsc(
            ChatConversation conversation
    );

    long countByConversationAndSenderNotAndReadAtIsNull(
            ChatConversation conversation,
            User sender
    );

    @Modifying
    @Query("""
        UPDATE ChatMessage m
        SET m.readAt = CURRENT_TIMESTAMP
        WHERE m.conversation = :conversation
        AND m.sender <> :reader
        AND m.readAt IS NULL
    """)
    int markMessagesAsRead(
            @Param("conversation") ChatConversation conversation,
            @Param("reader") User reader
    );
}
