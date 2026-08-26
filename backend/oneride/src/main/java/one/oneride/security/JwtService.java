package one.oneride.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import one.oneride.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    @PostConstruct
    public void init() {

        System.out.println("====================================");
        System.out.println("JWT SECRET LOADED");
        System.out.println(secretKey);
        System.out.println("JWT Expiration : " + jwtExpiration);
        System.out.println("====================================");
    }

    /**
     * Generate JWT for authenticated user.
     */
    public String generateToken(User user) {

        String token = Jwts.builder()
                .subject(user.getPhoneNumber())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSigningKey())
                .compact();

        System.out.println("====================================");
        System.out.println("GENERATED JWT");
        System.out.println(token);
        System.out.println("====================================");

        return token;
    }

    /**
     * Extract phone number from JWT.
     */
    public String extractPhoneNumber(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Check whether the token belongs to the user and is not expired.
     */
    public boolean isTokenValid(String token, User user) {

        String phoneNumber = extractPhoneNumber(token);

        return phoneNumber.equals(user.getPhoneNumber())
                && !isTokenExpired(token);
    }

    /**
     * Check token expiration.
     */
    private boolean isTokenExpired(String token) {

        return extractExpiration(token)
                .before(new Date());
    }

    /**
     * Extract expiration date.
     */
    private Date extractExpiration(String token) {

        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Generic method to extract any claim.
     */
    private <T> T extractClaim(
            String token,
            Function<Claims, T> claimsResolver) {

        Claims claims = extractAllClaims(token);

        return claimsResolver.apply(claims);
    }

    /**
     * Parse all claims from JWT.
     */
    private Claims extractAllClaims(String token) {

        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Create signing key from secret.
     */
    private SecretKey getSigningKey() {

        return Keys.hmacShaKeyFor(
                secretKey.getBytes(StandardCharsets.UTF_8)
        );
    }
}