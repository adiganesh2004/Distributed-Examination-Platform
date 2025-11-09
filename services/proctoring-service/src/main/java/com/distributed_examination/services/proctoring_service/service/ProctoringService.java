package com.distributed_examination.services.proctoring_service.service;

import com.distributed_examination.services.proctoring_service.repository.ProctoringRepository;

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

@Service
public class ProctoringService {

    private final ProctoringRepository repository;
    private CascadeClassifier faceDetector;

    ProctoringService(ProctoringRepository repository) {
        this.repository = repository;
    }

    @PostConstruct
    public void init() {
        nu.pattern.OpenCV.loadLocally();
        faceDetector = new CascadeClassifier(getClass().getClassLoader()
                .getResource("haarcascade_frontalface_default.xml").getPath());
    }

    public void processImage(byte[] imageBytes, String testId, String candidateId) throws IOException {
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
    }

}
