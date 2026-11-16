
package one.oneride.repository;

import one.oneride.entity.ChatConversation;
import one.oneride.entity.User;
import one.oneride.enums.ChatServiceType;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatConversationRepository
        extends JpaRepository<ChatConversation, Long> {

    Optional<ChatConversation>
    findByServiceTypeAndServiceReferenceIdAndCustomerAndProvider(
            ChatServiceType serviceType,
            Long serviceReferenceId,
            User customer,
            User provider
    );

    List<ChatConversation> findByCustomerOrProviderOrderByLastMessageAtDesc(
            User customer,
            User provider
    );

    List<ChatConversation> findByCustomerOrderByCreatedAtDesc(
            User customer
    );

    List<ChatConversation> findByProviderOrderByCreatedAtDesc(
            User provider
    );

    Optional<ChatConversation> findByIdAndCustomerOrIdAndProvider(
            Long customerConversationId,
            User customer,
            Long providerConversationId,
            User provider
    );
}
