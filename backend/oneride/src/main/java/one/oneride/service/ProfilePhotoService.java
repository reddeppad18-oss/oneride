package one.oneride.service;

import org.springframework.web.multipart.MultipartFile;

public interface ProfilePhotoService {

    String uploadProfilePhoto(
            String phoneNumber,
            MultipartFile file
    );

    void deleteProfilePhoto(
            String phoneNumber
    );
}
