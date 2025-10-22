package com.pjplastic.pjplastic_backend.service;

import org.springframework.web.multipart.MultipartFile;

public interface CloudinaryService {
    /**
     * Upload a file to Cloudinary and return the secure URL.
     */
    String uploadImage(MultipartFile file, String folder);
}
