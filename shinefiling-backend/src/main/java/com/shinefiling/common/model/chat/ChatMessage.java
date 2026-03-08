package com.shinefiling.common.model.chat;

import lombok.Data;

@Data
public class ChatMessage {
    private String id;
    private String senderEmail;
    private String senderName;
    private String senderRole; // USER, ADMIN, SYSTEM
    private String message;
    private String ticketId;
    private String timestamp; // Store as String for easier JSON file handling
    private boolean isRead = false;
    private boolean isEdited = false;
}
