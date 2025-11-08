package com.distributed_examination.services.proctoring_service.controller;


import com.distributed_examination.common.jwt.JwtUtil;
import com.distributed_examination.services.proctoring_service.model.ProctoringData;
import com.distributed_examination.services.proctoring_service.service.ProctoringService;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class ProctoringHandler extends TextWebSocketHandler {

    private final ProctoringService service;
    private final JwtUtil jwtUtil;

    public ProctoringHandler(ProctoringService service, JwtUtil jwtUtil) {
        this.service = service;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // System.out.println("This connection established");
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        System.out.println("Hello world!!");
        ProctoringData newData = convertToProctoringData(message);
        System.out.println(message.getPayload());
        service.processImage(newData.toByteArray(), newData.testId, newData.userId);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
    }
    
    private ProctoringData convertToProctoringData(TextMessage message) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode jsonNode = mapper.readTree(message.getPayload());
    
            String token = jsonNode.hasNonNull("token") ? jsonNode.get("token").asText() : null;
            String testId = jsonNode.hasNonNull("testId") ? jsonNode.get("testId").asText() : null;
            String userId = jwtUtil.extractId(token);
            String imageBase64 = jsonNode.hasNonNull("imageBase64") ? jsonNode.get("imageBase64").asText() : null;
    
            return new ProctoringData(testId,token,imageBase64,userId);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}