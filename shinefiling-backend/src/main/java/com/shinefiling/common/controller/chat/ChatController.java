package com.shinefiling.common.controller.chat;

import com.shinefiling.common.model.chat.ChatMessage;
import com.shinefiling.common.service.chat.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*") // Allow all for now, SecurityConfig handles the rest
public class ChatController {

    @Autowired
    private ChatService chatService;

    @GetMapping("/history/{ticketId}")
    public ResponseEntity<List<ChatMessage>> getChatHistory(@PathVariable String ticketId) {
        return ResponseEntity.ok(chatService.getChatHistory(ticketId));
    }

    @PostMapping("/send")
    public ResponseEntity<ChatMessage> sendMessage(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String message = payload.get("message");
        String ticketId = payload.get("ticketId");
        String role = payload.get("role"); // Optional: to distinguish User vs Admin if needed explicitly

        if (role != null && role.equalsIgnoreCase("ADMIN")) {
            return ResponseEntity.ok(chatService.sendAdminResponse(email, message, ticketId));
        }

        return ResponseEntity.ok(chatService.sendMessage(email, message, ticketId));
    }

    @PutMapping("/read/{ticketId}")
    public ResponseEntity<Void> markAsRead(@PathVariable String ticketId, @RequestParam String role) {
        chatService.markAsRead(ticketId, role);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/unread")
    public ResponseEntity<Map<String, Integer>> getUnreadCounts() {
        return ResponseEntity.ok(chatService.getUnreadCountsForAdmin());
    }

    @GetMapping("/unread/user")
    public ResponseEntity<Map<String, Integer>> getUserUnreadCounts(@RequestParam String email) {
        return ResponseEntity.ok(chatService.getUnreadCountsForUser(email));
    }

    // --- Message Management ---

    @PutMapping("/message/{ticketId}/{messageId}")
    public ResponseEntity<Void> editMessage(@PathVariable String ticketId, @PathVariable String messageId,
            @RequestBody Map<String, String> payload) {
        if (chatService.editMessage(ticketId, messageId, payload.get("message"))) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/message/{ticketId}/{messageId}")
    public ResponseEntity<Void> deleteMessage(@PathVariable String ticketId, @PathVariable String messageId) {
        if (chatService.deleteMessage(ticketId, messageId)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/history/{ticketId}")
    public ResponseEntity<Void> clearChat(@PathVariable String ticketId) {
        if (chatService.clearChat(ticketId)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.internalServerError().build();
    }

    // --- Typing Status ---

    @PostMapping("/typing/{ticketId}")
    public ResponseEntity<Void> setTypingStatus(@PathVariable String ticketId,
            @RequestBody Map<String, Object> payload) {
        String role = (String) payload.get("role");
        boolean isTyping = (Boolean) payload.get("isTyping");
        chatService.setTypingStatus(ticketId, role, isTyping);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/typing/{ticketId}")
    public ResponseEntity<List<String>> getTypingStatus(@PathVariable String ticketId) {
        return ResponseEntity.ok(chatService.getWhoIsTyping(ticketId));
    }
}
