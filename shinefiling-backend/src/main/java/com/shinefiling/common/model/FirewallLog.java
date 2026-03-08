package com.shinefiling.common.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "firewall_logs")
public class FirewallLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ipAddress;
    private String requestUrl;
    private String method;

    private String blockReason; // RATELIMIT, SQL_INJECTION, XSS

    @Column(columnDefinition = "TEXT")
    private String payload; // The malicious payload if any

    private LocalDateTime timestamp = LocalDateTime.now();

    private String status; // BLOCKED
}
