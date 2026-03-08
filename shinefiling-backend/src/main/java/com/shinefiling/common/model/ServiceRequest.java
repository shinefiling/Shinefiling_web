package com.shinefiling.common.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "service_requests")
public class ServiceRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String serviceName;

    private String status; // PENDING, PROCESSING, COMPLETED, REJECTED, ASSIGNED

    @Column(columnDefinition = "TEXT")
    private String formData;

    private LocalDateTime createdAt = LocalDateTime.now();

    private String documentUrl;

    private String plan; // BASIC, STANDARD, PREMIUM
    private Double amount;
    private String paymentStatus; // PENDING, PAID, FAILED

    private Long currentJobId;

    // Existing fields...
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_agent_id")
    private User assignedAgent;

    private String agentEmail;

    private LocalDateTime updatedAt = LocalDateTime.now();

    // CRM Fields
    private Double boundAmount; // Amount fixed by Super Admin

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_ca_id")
    private User assignedCa;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_employee_id")
    private User assignedEmployee;

    private String caApprovalStatus; // PENDING_APPROVAL, ACCEPTED, REJECTED, QUERY_RAISED

    @Column(columnDefinition = "TEXT")
    private String adminComments; // Instructions from Super Admin to CA

    private String biddingStatus; // OPEN, CLOSED

    @Column(columnDefinition = "TEXT")
    private String generatedDocuments; // JSON string of final deliverables

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
