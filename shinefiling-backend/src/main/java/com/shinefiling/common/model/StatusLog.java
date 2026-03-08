package com.shinefiling.common.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "status_logs")
public class StatusLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private ServiceRequest order;

    private String oldStatus;
    private String newStatus;
    private LocalDateTime changedAt = LocalDateTime.now();
    private String changedBy; // Admin or System or Client
}
