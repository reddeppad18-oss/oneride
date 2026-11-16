
package one.oneride.security;

import lombok.RequiredArgsConstructor;
import one.oneride.entity.User;
import one.oneride.repository.UserRepository;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.Optional;

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
                MessageHeaderAccessor.getAccessor(
                        message,
                        StompHeaderAccessor.class
                );

        if (accessor == null) {
            return message;
        }

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {

            String authHeader =
                    accessor.getFirstNativeHeader("Authorization");

            if (authHeader == null ||
                    !authHeader.startsWith("Bearer ")) {

                throw new BadCredentialsException(
                        "Missing authentication token"
                );
            }

            String jwt = authHeader.substring(7);

            try {

                String phoneNumber =
                        jwtService.extractPhoneNumber(jwt);

                if (phoneNumber == null) {
                    throw new BadCredentialsException(
                            "Invalid authentication token"
                    );
                }

                Optional<User> optionalUser =
                        userRepository.findByPhoneNumber(phoneNumber);

                if (optionalUser.isEmpty()) {
                    throw new BadCredentialsException(
                            "User not found"
                    );
                }

                User user = optionalUser.get();

                if (!jwtService.isTokenValid(jwt, user)) {
                    throw new BadCredentialsException(
                            "Invalid or expired token"
                    );
                }

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                user.getPhoneNumber(),
                                null,
                                user.getAuthorities()
                        );

                accessor.setUser(authentication);

            } catch (BadCredentialsException exception) {
                throw exception;
            } catch (Exception exception) {
                throw new BadCredentialsException(
                        "WebSocket authentication failed",
                        exception
                );
            }
        }

        return message;
    }
}
