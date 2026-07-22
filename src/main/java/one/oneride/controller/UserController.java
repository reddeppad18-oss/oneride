package one.oneride.controller;

import lombok.RequiredArgsConstructor;
import one.oneride.dto.UserResponse;
import one.oneride.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin("*")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public UserResponse getCurrentUser(Authentication authentication) {

        String phoneNumber = authentication.getName();

        return userService.getCurrentUser(phoneNumber);
    }
}