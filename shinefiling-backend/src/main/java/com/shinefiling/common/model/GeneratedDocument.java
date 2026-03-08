package com.shinefiling.common.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "generated_documents")
public class GeneratedDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private ServiceRequest order;

    private String name; // Application Form, Declaration, etc.
    private String filePath;
    private LocalDateTime generatedAt = LocalDateTime.now();
}
