package com.distributed_examination.services.test_taking_service.model;

import java.util.Base64;

public class ProctoringData {
    public String testId;
    public String token;
    public String imageBase64;
    public String userId;

    public ProctoringData(String testId, String token, String imageBase64, String userId) {
        this.testId = testId;
        this.token = token;
        this.imageBase64 = imageBase64;
        this.userId = userId;
    }

    public byte[] toByteArray() {
        try {
            String base64 = this.imageBase64;

            // Strip data URL prefix (e.g. "data:image/png;base64,")
            if (base64.contains(",")) {
                base64 = base64.split(",")[1];
            }

            byte[] imageBytes = Base64.getDecoder().decode(base64);

            // Create a MultipartFile (Spring Mock implementation)
            return imageBytes;
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert Base64 to MultipartFile: " + e.getMessage(), e);
        }
    }
}
