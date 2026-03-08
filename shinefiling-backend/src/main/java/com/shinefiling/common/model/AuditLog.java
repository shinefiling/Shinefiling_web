package com.shinefiling.common.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "audit_logs")
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime timestamp = LocalDateTime.now();
    private Long serviceRequestId; // Replaces orderId in users spec (mapped to ServiceRequest)

    private String eventType; // AutomationStageCompleted, OrderVerified, etc.
    private String actor; // admin_1, client_2, automation_worker

    @Column(columnDefinition = "TEXT")
    private String payloadJson; // JSON data

    // Deprecated fields kept for backward compatibility if needed, or mapped
    // private String severity;
    // private String type;
    // private String action;
    // private String userEmail;
    // private String ipAddress;
    // private String resource;
    // private String details; -- mapping details to payloadJson if needed
}
