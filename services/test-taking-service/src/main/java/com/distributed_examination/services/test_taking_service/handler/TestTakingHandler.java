package com.distributed_examination.services.test_taking_service.handler;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.distributed_examination.services.test_taking_service.repository.TestTakingRepository;
import com.distributed_examination.services.test_taking_service.model.TestAction;
import com.distributed_examination.common.jwt.JwtUtil;

@Component
public class TestTakingHandler extends TextWebSocketHandler {

    private final TestTakingRepository repository;
    private final JwtUtil jwtUtil;

    public TestTakingHandler(TestTakingRepository repository, JwtUtil jwtUtil) {
        this.repository = repository;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        TestAction testAction = convertToTestAction(message);
        if (testAction == null) {
            session.sendMessage(new TextMessage("{\"error\":\"Invalid request\"}"));
            return;
        }
        if ("start_test".equalsIgnoreCase(testAction.getType())) {
            String response = repository.startTest(session.getId(), testAction);
            session.sendMessage(new TextMessage(response));
        } else {
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
    
            String userId = jwtUtil.extractId(token);
    
            return new TestAction(token, userId, type, testId, nextQuestionId, currentQuestionId, chosenOption);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    
}