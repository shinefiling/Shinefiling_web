package com.shinefiling.common.controller;

import com.shinefiling.common.model.Notification;
import com.shinefiling.common.model.User;
import com.shinefiling.common.repository.UserRepository;
import com.shinefiling.common.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Notification> getMyNotifications(@RequestParam String email) {
        Optional<User> user = userRepository.findByEmail(email);
        return user.map(value -> notificationService.getUserNotifications(value))
                .orElse(java.util.Collections.emptyList());
    }

    @PostMapping("/{id}/read")
    public void markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
    }

    @PostMapping("/mark-all-read")
    public void markAllRead(@RequestParam String email) {
        Optional<User> user = userRepository.findByEmail(email);
        user.ifPresent(value -> notificationService.markAllRead(value));
    }

    @GetMapping("/system/unread")
    public List<Notification> getSystemUnread() {
        return notificationService.getUnreadSystemNotifications();
    }
}
