package com.shinefiling.common.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Testimonial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private String serviceName;
    private String feedback;
    private int rating;
    private boolean approved = false;
    private LocalDateTime createdAt = LocalDateTime.now();
}
