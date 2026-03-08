package com.shinefiling.common.service.chat;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.common.model.User;
import com.shinefiling.common.model.chat.ChatMessage;
import com.shinefiling.common.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ChatService {

    @Autowired
    private UserRepository userRepository;

    private final String CHAT_DIR = "uploads/chats/";
    private final ObjectMapper objectMapper = new ObjectMapper();

    // In-memory storage for typing status: TicketId -> (Role ->
    // LastTypingTimestamp)
    private final java.util.Map<String, java.util.Map<String, Long>> typingStatusMap = new java.util.concurrent.ConcurrentHashMap<>();

    public ChatService() {
        // Ensure directory exists
        File dir = new File(CHAT_DIR);
        if (!dir.exists()) {
            dir.mkdirs();
        }
    }

    public ChatMessage sendMessage(String senderEmail, String message, String ticketId) {
        ChatMessage chat = new ChatMessage();
        chat.setId(UUID.randomUUID().toString());
        chat.setMessage(message);
        chat.setTicketId(ticketId);
        chat.setTimestamp(LocalDateTime.now().toString());
        chat.setSenderEmail(senderEmail);

        Optional<User> userOpt = userRepository.findByEmail(senderEmail);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            chat.setSenderName(user.getFullName());
            chat.setSenderRole(user.getRole());
        } else {
            chat.setSenderName(senderEmail);
            chat.setSenderRole("GUEST");
        }

        savemessageToFile(chat, ticketId);
        return chat;
    }

    // For Admin responding
    public ChatMessage sendAdminResponse(String adminEmail, String message, String ticketId) {
        ChatMessage chat = new ChatMessage();
        chat.setId(UUID.randomUUID().toString());
        chat.setMessage(message);
        chat.setTicketId(ticketId);
        chat.setTimestamp(LocalDateTime.now().toString());
        chat.setSenderRole("ADMIN");
        chat.setSenderEmail(adminEmail);
        chat.setSenderName("Support Agent");

        Optional<User> adminIt = userRepository.findByEmail(adminEmail);
        if (adminIt.isPresent()) {
            chat.setSenderName(adminIt.get().getFullName());
        }

        savemessageToFile(chat, ticketId);
        return chat;
    }

    public List<ChatMessage> getChatHistory(String ticketId) {
        return readMessagesFromFile(ticketId);
    }

    // --- FILE I/O HELPERS ---

    private synchronized void savemessageToFile(ChatMessage message, String ticketId) {
        try {
            List<ChatMessage> history = readMessagesFromFile(ticketId);
            history.add(message);
            File file = new File(CHAT_DIR + ticketId + ".json");
            objectMapper.writeValue(file, history);
        } catch (IOException e) {
            e.printStackTrace();
            System.err.println("Failed to save chat message to file: " + e.getMessage());
        }
    }

    private List<ChatMessage> readMessagesFromFile(String ticketId) {
        File file = new File(CHAT_DIR + ticketId + ".json");
        if (!file.exists()) {
            return new ArrayList<>();
        }
        try {
            return objectMapper.readValue(file, new TypeReference<List<ChatMessage>>() {
            });
        } catch (IOException e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public void markAsRead(String ticketId, String readerRole) {
        try {
            List<ChatMessage> history = readMessagesFromFile(ticketId);
            boolean modified = false;
            for (ChatMessage msg : history) {
                // If message is NOT from the reader (i.e. from the other party) and is unread
                // e.g. Reader is ADMIN, msg is from USER/GUEST -> Mark as read
                // e.g. Reader is USER, msg is from ADMIN -> Mark as read
                if (!msg.isRead() && !msg.getSenderRole().equalsIgnoreCase(readerRole)) {
                    msg.setRead(true);
                    modified = true;
                }
            }
            if (modified) {
                File file = new File(CHAT_DIR + ticketId + ".json");
                objectMapper.writeValue(file, history);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public java.util.Map<String, Integer> getUnreadCountsForAdmin() {
        java.util.Map<String, Integer> counts = new java.util.HashMap<>();
        File folder = new File(CHAT_DIR);
        File[] files = folder.listFiles();
        if (files == null)
            return counts;

        for (File file : files) {
            if (file.isFile() && file.getName().endsWith(".json")) {
                String ticketId = file.getName().replace(".json", "");
                try {
                    List<ChatMessage> history = objectMapper.readValue(file, new TypeReference<List<ChatMessage>>() {
                    });
                    int unread = 0;
                    for (ChatMessage msg : history) {
                        // Count unread messages NOT sent by ADMIN (so sent by USER/GUEST)
                        if (!msg.isRead() && !"ADMIN".equalsIgnoreCase(msg.getSenderRole())) {
                            unread++;
                        }
                    }
                    if (unread > 0) {
                        counts.put(ticketId, unread);
                    }
                } catch (Exception e) {
                    System.err.println("Error reading chat file for stats: " + file.getName());
                }
            }
        }
        return counts;
    }

    public java.util.Map<String, Integer> getUnreadCountsForUser(String email) {
        java.util.Map<String, Integer> counts = new java.util.HashMap<>();
        if (email == null || email.isEmpty())
            return counts;

        File folder = new File(CHAT_DIR);
        File[] files = folder.listFiles();
        if (files == null)
            return counts;

        for (File file : files) {
            if (file.isFile() && file.getName().endsWith(".json")) {
                String ticketId = file.getName().replace(".json", "");
                try {
                    List<ChatMessage> history = objectMapper.readValue(file, new TypeReference<List<ChatMessage>>() {
                    });

                    // Check if this chat belongs to the user (contains at least one message from
                    // them)
                    boolean isUserChat = history.stream().anyMatch(m -> email.equalsIgnoreCase(m.getSenderEmail()));

                    if (isUserChat) {
                        int unread = 0;
                        for (ChatMessage msg : history) {
                            // Count unread messages sent by ADMIN (not by the user)
                            if (!msg.isRead() && "ADMIN".equalsIgnoreCase(msg.getSenderRole())) {
                                unread++;
                            }
                        }
                        if (unread > 0) {
                            counts.put(ticketId, unread);
                        }
                    }
                } catch (Exception e) {
                    System.err.println("Error reading chat file for user stats: " + file.getName());
                }
            }
        }
        return counts;
    }

    // --- Message Management ---

    public boolean editMessage(String ticketId, String messageId, String newContent) {
        try {
            List<ChatMessage> history = readMessagesFromFile(ticketId);
            boolean updated = false;
            for (ChatMessage msg : history) {
                if (msg.getId().equals(messageId)) {
                    msg.setMessage(newContent);
                    msg.setEdited(true);
                    updated = true;
                    break;
                }
            }
            if (updated) {
                File file = new File(CHAT_DIR + ticketId + ".json");
                objectMapper.writeValue(file, history);
                return true;
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean deleteMessage(String ticketId, String messageId) {
        try {
            List<ChatMessage> history = readMessagesFromFile(ticketId);
            boolean removed = history.removeIf(msg -> msg.getId().equals(messageId));
            if (removed) {
                File file = new File(CHAT_DIR + ticketId + ".json");
                objectMapper.writeValue(file, history);
                return true;
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean clearChat(String ticketId) {
        File file = new File(CHAT_DIR + ticketId + ".json");
        // We can either delete the file or write an empty list.
        // Writing empty list keeps the file exists check valid but empty content.
        try {
            objectMapper.writeValue(file, new ArrayList<>());
            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }

    // --- Typing Status ---

    public void setTypingStatus(String ticketId, String role, boolean isTyping) {
        typingStatusMap.computeIfAbsent(ticketId, k -> new java.util.concurrent.ConcurrentHashMap<>());
        if (isTyping) {
            typingStatusMap.get(ticketId).put(role, System.currentTimeMillis());
        } else {
            typingStatusMap.get(ticketId).remove(role);
        }
    }

    public List<String> getWhoIsTyping(String ticketId) {
        java.util.Map<String, Long> status = typingStatusMap.get(ticketId);
        List<String> typingRoles = new ArrayList<>();
        if (status == null)
            return typingRoles;

        long now = System.currentTimeMillis();
        // Remove stale entries older than 10 seconds
        status.entrySet().removeIf(entry -> (now - entry.getValue()) > 10000);

        return new ArrayList<>(status.keySet());
    }
}
