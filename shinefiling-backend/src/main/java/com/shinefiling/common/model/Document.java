package com.shinefiling.common.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "documents")
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "service_request_id")
    private ServiceRequest serviceRequest;

    private String type; // e.g., "PAN", "AADHAAR", "MOA", "AOA"
    private String filename;
    private String url;

    private String status; // UPLOADED, VERIFIED, REJECTED, NEEDS_REVISION

    private String uploadedBy; // "CLIENT" or "ADMIN"
    private LocalDateTime uploadedAt = LocalDateTime.now();

    @Column(columnDefinition = "TEXT")
    private String rejectionReason;
}
