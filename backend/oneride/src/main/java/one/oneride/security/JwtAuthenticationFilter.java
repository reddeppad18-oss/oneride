package one.oneride.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import one.oneride.entity.User;
import one.oneride.repository.UserRepository;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // Allow CORS preflight requests
        if (request.getMethod().equalsIgnoreCase("OPTIONS")) {
            filterChain.doFilter(request, response);
            return;
        }

        System.out.println("=== JWT FILTER EXECUTED ===");

        final String authHeader =
                request.getHeader("Authorization");

        // No Authorization header
        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            System.out.println("No Bearer Token Found");

            filterChain.doFilter(request, response);
            return;
        }

        // Extract JWT token
        final String jwt = authHeader.substring(7);

        try {

            // Extract phone number from JWT
            final String phoneNumber =
                    jwtService.extractPhoneNumber(jwt);

            System.out.println(
                    "JWT Phone Number: " + phoneNumber
            );

            // Only authenticate if user isn't already authenticated
            if (phoneNumber != null &&
                    SecurityContextHolder
                            .getContext()
                            .getAuthentication() == null) {

                // Find user using phone number
                Optional<User> optionalUser =
                        userRepository.findByPhoneNumber(phoneNumber);

                if (optionalUser.isPresent()) {

                    User user = optionalUser.get();

                    // Validate JWT
                    if (jwtService.isTokenValid(jwt, user)) {

                        UsernamePasswordAuthenticationToken
                                authentication =
                                new UsernamePasswordAuthenticationToken(
                                        user.getPhoneNumber(),
                                        null,
                                        user.getAuthorities()
                                );

                        authentication.setDetails(
                                new WebAuthenticationDetailsSource()
                                        .buildDetails(request)
                        );

                        SecurityContextHolder
                                .getContext()
                                .setAuthentication(authentication);

                        System.out.println(
                                "JWT Authentication Successful"
                        );

                    } else {

                        System.out.println(
                                "JWT Token Invalid"
                        );
                    }

                } else {

                    System.out.println(
                            "User Not Found: " + phoneNumber
                    );
                }
            }

        } catch (Exception e) {

            System.out.println(
                    "JWT Authentication Error: "
                            + e.getMessage()
            );
        }

        // Continue request
        filterChain.doFilter(request, response);
    }
}