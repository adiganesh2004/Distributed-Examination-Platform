package com.distributed_examination.services.test_taking_service.service;

import com.distributed_examination.services.test_taking_service.repository.ProctoringRepository;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import jakarta.annotation.PostConstruct;

import org.opencv.core.Mat;
import org.opencv.core.MatOfByte;
import org.opencv.core.MatOfRect;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.objdetect.CascadeClassifier;

import nu.pattern.OpenCV;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;

@Service
public class ProctoringService {

    private final ProctoringRepository repository;
    private CascadeClassifier faceDetector;

    ProctoringService(ProctoringRepository repository) {
        this.repository = repository;
    }

    @PostConstruct
    public void init() {
        try {
            nu.pattern.OpenCV.loadLocally();
    
            InputStream cascadeStream = getClass().getClassLoader()
                    .getResourceAsStream("haarcascade_frontalface_default.xml");
    
            if (cascadeStream == null) {
                throw new RuntimeException("❌ Cascade file not found in resources!");
            }
    
            File tempFile = File.createTempFile("haarcascade", ".xml");
            tempFile.deleteOnExit();
    
            try (OutputStream os = new FileOutputStream(tempFile)) {
                byte[] buffer = new byte[1024];
                int bytesRead;
                while ((bytesRead = cascadeStream.read(buffer)) != -1) {
                    os.write(buffer, 0, bytesRead);
                }
            }
            
            faceDetector = new org.opencv.objdetect.CascadeClassifier(tempFile.getAbsolutePath());
    
            if (faceDetector.empty()) {
                throw new RuntimeException("❌ Failed to load CascadeClassifier from " + tempFile.getAbsolutePath());
            }
    
            System.out.println("✅ Face detector initialized successfully!");
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to initialize face detector"+e.toString());
        }
    }

    public void processImage(byte[] imageBytes, String testId, String candidateId){
        try{
        // Decode bytes to OpenCV Mat (directly, no temp file)
        Mat img = Imgcodecs.imdecode(new MatOfByte(imageBytes), Imgcodecs.IMREAD_COLOR);

        if (img.empty()) {
            throw new IOException("Failed to decode image bytes into OpenCV Mat");
        }

        // Detect faces
        MatOfRect faces = new MatOfRect();
        faceDetector.detectMultiScale(img, faces);

        int faceCount = faces.toArray().length;
        System.out.println("Detected faces: " + faceCount);

        // Store or log result
        repository.recordFaceCount(testId, candidateId, faceCount);
        }catch(Exception e) {
            e.printStackTrace();
            System.out.println("Failed to initialize face detector"+e.toString());
        }
    }

}
