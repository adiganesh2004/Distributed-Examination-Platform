package com.distributed_examination.services.test_taking_service.handler;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.distributed_examination.services.test_taking_service.repository.TestTakingRepository;
import com.distributed_examination.services.test_taking_service.model.TestAction;
import com.distributed_examination.common.jwt.JwtUtil;

import com.distributed_examination.services.test_taking_service.service.ProctoringService;

@Component
public class TestTakingHandler extends TextWebSocketHandler {

    private final TestTakingRepository repository;
    private final JwtUtil jwtUtil;
    private final ProctoringService service;

    public TestTakingHandler(TestTakingRepository repository, JwtUtil jwtUtil, ProctoringService service) {
        this.repository = repository;
        this.service = service;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // System.out.println("This connection established");
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        if (message == null || message.getPayload() == null|| message.getPayload().isBlank()){
            System.err.println("⚠️ Received null or empty WebSocket message from: " + session.getId());
            return;
        }

        TestAction testAction = convertToTestAction(message);
        if (testAction == null) {
            session.sendMessage(new TextMessage("{\"error\":\"Invalid request\"}"));
            return;
        }
        System.out.println(testAction.getType());
        if ("start_test".equalsIgnoreCase(testAction.getType())) {
            System.out.println("New test received");
            String response = repository.startTest(session.getId(), testAction);
            session.sendMessage(new TextMessage(response));
        }else if("change_question".equalsIgnoreCase(testAction.getType())){
            System.out.println("change question received");
            String response = repository.changeQuestion(session.getId(), testAction);
            session.sendMessage(new TextMessage(response));
        }else if("change_answer".equalsIgnoreCase(testAction.getType())){
            System.out.println("change answer received");
            String response = repository.changeAnswer(session.getId(), testAction);
            session.sendMessage(new TextMessage(response));
        }else if("end_test".equalsIgnoreCase(testAction.getType())){
            System.out.println("end test received");
            String response = repository.endTest(session.getId());
            session.sendMessage(new TextMessage(response));
        }else if("proctor".equalsIgnoreCase(testAction.getType())){
            System.out.println("proctor test received");
            session.sendMessage(new TextMessage("{\"success\":\"Got the image\"}"));
            service.processImage(testAction.toByteArray(),testAction.getTestId(),testAction.getUserId());
        }else {
            session.sendMessage(new TextMessage("{\"error\":\"Unknown action type\"}"));
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
    }

    private TestAction convertToTestAction(TextMessage message) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode jsonNode = mapper.readTree(message.getPayload());
    
            String token = jsonNode.hasNonNull("token") ? jsonNode.get("token").asText() : null;
            String type = jsonNode.hasNonNull("type") ? jsonNode.get("type").asText() : null;
            String testId = jsonNode.hasNonNull("testId") ? jsonNode.get("testId").asText() : null;
            String nextQuestionId = jsonNode.hasNonNull("nextQuestionId") ? jsonNode.get("nextQuestionId").asText() : null;
            String currentQuestionId = jsonNode.hasNonNull("currentQuestionId") ? jsonNode.get("currentQuestionId").asText() : null;
            int chosenOption = jsonNode.hasNonNull("chosenOption") ? jsonNode.get("chosenOption").asInt() : -1;
            String imageBase64 = jsonNode.hasNonNull("imageBase64") ? jsonNode.get("imageBase64").asText() : null;
            String userId = jwtUtil.extractId(token);
    
            return new TestAction(token, userId, type, testId, nextQuestionId, currentQuestionId, chosenOption, imageBase64);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    
}