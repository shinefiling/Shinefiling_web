package com.shinefiling.common.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id") // The recipient. If null, it could be a system broadcast or admin alert.
    private User user;

    private String type; // INFO, SUCCESS, WARNING, ERROR
    private String title;
    private String message;

    // Link to related entity (optional)
    private String referenceId; // e.g., "ORD-123"
    private String referenceType; // e.g., "ORDER", "PAYMENT"

    @Column(name = "is_read")
    private boolean isRead = false;
    private LocalDateTime createdAt = LocalDateTime.now();

    // For Admin Broadcasts, we might want a 'targetRole' field, but for now simple
    // User mapping is fine.
    // If user is null, it might be visible to ALL Admins.
}
