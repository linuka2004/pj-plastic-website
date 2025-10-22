package com.pjplastic.pjplastic_backend.service.impl;

import com.cloudinary.Cloudinary;
import com.pjplastic.pjplastic_backend.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Value;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class CloudinaryServiceImpl implements CloudinaryService {

    private final Cloudinary cloudinary;

    @Value("${cloudinary.folder:products}")
    private String defaultFolder;

    @Value("${cloudinary.cloud_name:}")
    private String cloudName;

    @Value("${cloudinary.api_key:}")
    private String apiKey;

    @Value("${cloudinary.api_secret:}")
    private String apiSecret;

    private static final Logger log = LoggerFactory.getLogger(CloudinaryServiceImpl.class);

    public CloudinaryServiceImpl(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    @Override
    public String uploadImage(MultipartFile file, String folder) {
        String targetFolder = (folder == null || folder.isBlank()) ? defaultFolder : folder;
        if (cloudName == null || cloudName.isBlank() || apiKey == null || apiKey.isBlank() || apiSecret == null || apiSecret.isBlank()) {
            throw new RuntimeException("Cloudinary credentials are not configured. Please set cloudinary.cloud_name, cloudinary.api_key, and cloudinary.api_secret in application.properties");
        }
        try {
            Map<String, Object> options = new HashMap<>();
            options.put("folder", targetFolder);
            options.put("resource_type", "image");
            options.put("overwrite", true);
            log.info("Uploading to Cloudinary: name={}, size={} bytes, type={}, folder={}", file.getOriginalFilename(), file.getSize(), file.getContentType(), targetFolder);
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), options);
            Object secureUrl = uploadResult.get("secure_url");
            log.info("Cloudinary upload success. secure_url={}", secureUrl);
            return secureUrl != null ? secureUrl.toString() : null;
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image to Cloudinary: " + e.getMessage(), e);
        }
    }
}
