package one.oneride.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import one.oneride.entity.User;
import one.oneride.repository.UserRepository;
import one.oneride.service.ProfilePhotoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProfilePhotoServiceImpl implements ProfilePhotoService {

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;

    private static final String CLOUDINARY_FOLDER =
            "alrides/profile-photos";

    private final Cloudinary cloudinary;

    private final UserRepository userRepository;

    @Override
    @Transactional
    public String uploadProfilePhoto(
            String phoneNumber,
            MultipartFile file
    ) {

        if (file == null || file.isEmpty()) {
            throw new RuntimeException(
                    "Profile photo is required"
            );
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new RuntimeException(
                    "Profile photo must be less than 5 MB"
            );
        }

        String contentType = file.getContentType();

        if (contentType == null ||
                !contentType.toLowerCase()
                        .startsWith("image/")) {

            throw new RuntimeException(
                    "Only image files are allowed"
            );
        }

        User user = userRepository
                .findByPhoneNumber(phoneNumber)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        String publicId =
                CLOUDINARY_FOLDER +
                        "/user_" +
                        user.getId();

        try {

            Map<?, ?> result =
                    cloudinary.uploader().upload(
                            file.getBytes(),
                            ObjectUtils.asMap(
                                    "folder",
                                    CLOUDINARY_FOLDER,
                                    "public_id",
                                    "user_" + user.getId(),
                                    "overwrite",
                                    true,
                                    "resource_type",
                                    "image"
                            )
                    );

            Object secureUrl =
                    result.get("secure_url");

            if (secureUrl == null) {
                throw new RuntimeException(
                        "Cloudinary did not return a photo URL"
                );
            }

            String photoUrl =
                    secureUrl.toString();

            user.setProfilePhotoUrl(photoUrl);

            userRepository.save(user);

            return photoUrl;

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to upload profile photo",
                    e
            );

        } catch (RuntimeException e) {

            throw e;

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to upload profile photo",
                    e
            );
        }
    }

    @Override
    @Transactional
    public void deleteProfilePhoto(
            String phoneNumber
    ) {

        User user = userRepository
                .findByPhoneNumber(phoneNumber)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        if (user.getProfilePhotoUrl() == null ||
                user.getProfilePhotoUrl()
                        .trim()
                        .isEmpty()) {

            return;
        }

        String publicId =
                CLOUDINARY_FOLDER +
                        "/user_" +
                        user.getId();

        try {

            cloudinary.uploader().destroy(
                    publicId,
                    ObjectUtils.asMap(
                            "resource_type",
                            "image"
                    )
            );

            user.setProfilePhotoUrl(null);

            userRepository.save(user);

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to delete profile photo",
                    e
            );
        }
    }
}

