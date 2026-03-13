package com.shinefiling.common.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String type; // CREDIT, DEBIT
    private BigDecimal amount;
    private String description;
    private String status; // SUCCESS, PENDING, FAILED
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private Long referenceId; 
    private String referenceType; // SERVICE_REQUEST, WITHDRAWAL
}
