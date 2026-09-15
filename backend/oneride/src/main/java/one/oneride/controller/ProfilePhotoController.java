package one.oneride.controller;

import lombok.RequiredArgsConstructor;
import one.oneride.dto.MessageResponse;
import one.oneride.service.ProfilePhotoService;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ProfilePhotoController {

    private final ProfilePhotoService profilePhotoService;

    @PostMapping(
            value = "/profile/photo",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public MessageResponse uploadProfilePhoto(
            Authentication authentication,
            @RequestParam("file") MultipartFile file
    ) {

        String phoneNumber = authentication.getName();

        String photoUrl =
                profilePhotoService.uploadProfilePhoto(
                        phoneNumber,
                        file
                );

        return MessageResponse.builder()
                .message(photoUrl)
                .build();
    }

    @DeleteMapping("/profile/photo")
    public MessageResponse deleteProfilePhoto(
            Authentication authentication
    ) {

        String phoneNumber = authentication.getName();

        profilePhotoService.deleteProfilePhoto(
                phoneNumber
        );

        return MessageResponse.builder()
                .message("Profile photo deleted successfully")
                .build();
    }
}

