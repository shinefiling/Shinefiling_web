package com.shinefiling.common.service;

import com.shinefiling.common.model.Notification;
import com.shinefiling.common.model.User;
import com.shinefiling.common.repository.NotificationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public void createNotification(User user, String type, String title, String message, String refId, String refType) {
        Notification n = new Notification();
        n.setUser(user);
        n.setType(type);
        n.setTitle(title);
        n.setMessage(message);
        n.setReferenceId(refId);
        n.setReferenceType(refType);
        n.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(n);
    }

    // Broadcast to all admins
    public void notifyAdmins(String type, String title, String message, String refId) {
        // Option 1: Create a notification for every admin
        // List<User> admins = userRepository.findByRole("ADMIN");
        // For efficiency, we store as Null user (System Alert) which admins fetch
        // explicitly.
        // If findByRole not simple, we can store as Null user (System Alert)
        // Let's store as Null user for "Global Admin Alert"

        Notification n = new Notification();
        n.setUser(null); // System/Admin alert
        n.setType(type);
        n.setTitle(title);
        n.setMessage(message);
        n.setReferenceId(refId);
        n.setReferenceType("ADMIN_ALERT");
        notificationRepository.save(n);
        System.out.println("Admin Notification Saved: " + title);
    }

    // Actually, finding admins is better for specific persistence
    // But for simplicity, let's treat user=null as a pool for admins to fetch.

    public List<Notification> getUserNotifications(User user) {
        if (user == null)
            return java.util.Collections.emptyList();

        // If user is Admin, they might want to see Global alerts too?
        // For now, clean separation: Client sees their own. Admin sees Null ones?
        if (user.getRole().contains("ADMIN")) {
            return notificationRepository.findByUserOrUserIsNullOrderByCreatedAtDesc(user);
        }
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public void markAsRead(Long id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    public void markAllRead(User user) {
        List<Notification> list = getUserNotifications(user);
        for (Notification n : list) {
            n.setRead(true);
        }
        notificationRepository.saveAll(list);

    }

    public List<Notification> getUnreadSystemNotifications() {
        List<Notification> notifs = notificationRepository.findByUserIsNullAndIsReadFalseOrderByCreatedAtDesc();
        System.out.println("Fetched System Unread Notifs Count: " + (notifs != null ? notifs.size() : 0));
        return notifs;
    }
}
