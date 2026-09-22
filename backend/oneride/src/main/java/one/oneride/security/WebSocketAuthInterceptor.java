package one.oneride.security;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import one.oneride.entity.User;
import one.oneride.repository.UserRepository;

import java.util.List;

@Component
@RequiredArgsConstructor
public class WebSocketAuthInterceptor
        implements ChannelInterceptor {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Override
    public Message<?> preSend(
            Message<?> message,
            MessageChannel channel) {

        StompHeaderAccessor accessor =
                StompHeaderAccessor.wrap(message);

        if (StompCommand.CONNECT.equals(
                accessor.getCommand())) {

            String authorization =
                    accessor.getFirstNativeHeader(
                            "Authorization"
                    );

            if (authorization == null
                    || !authorization.startsWith("Bearer ")) {

                throw new IllegalArgumentException(
                        "Missing WebSocket Authorization header"
                );
            }

            String token =
                    authorization.substring(7);

            String phoneNumber =
                    jwtService.extractPhoneNumber(token);

            if (phoneNumber == null
                    || phoneNumber.isBlank()) {

                throw new IllegalArgumentException(
                        "Invalid JWT"
                );
            }

            User user =
                    userRepository
                            .findByPhoneNumber(phoneNumber)
                            .orElseThrow(() ->
                                    new IllegalArgumentException(
                                            "User not found"
                                    )
                            );

            if (!jwtService.isTokenValid(
                    token,
                    user
            )) {

                throw new IllegalArgumentException(
                        "Invalid or expired JWT"
                );
            }

            Authentication authentication =
                    new UsernamePasswordAuthenticationToken(
                            user.getPhoneNumber(),
                            null,
                            user.getAuthorities()
                    );

            accessor.setUser(authentication);
        }

        return message;
    }
}