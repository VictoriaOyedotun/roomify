package com.roomify.controller;

import com.roomify.dto.ConversationSummary;
import com.roomify.dto.MessageResponse;
import com.roomify.dto.SendMessageRequest;
import com.roomify.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/conversations")
    public ResponseEntity<ConversationSummary> getOrCreateConversation(@RequestBody Map<String, Long> body) {
        Long listingId = body.get("listingId");
        if (listingId == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(chatService.getOrCreateConversation(listingId));
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationSummary>> listConversations() {
        return ResponseEntity.ok(chatService.listMyConversations());
    }

    @GetMapping("/conversations/{id}/messages")
    public ResponseEntity<List<MessageResponse>> getMessages(@PathVariable Long id) {
        return ResponseEntity.ok(chatService.getMessages(id));
    }

    @PostMapping("/conversations/{id}/messages")
    public ResponseEntity<MessageResponse> sendMessage(@PathVariable Long id, @Valid @RequestBody SendMessageRequest request) {
        return ResponseEntity.ok(chatService.sendMessage(id, request));
    }
}
