package com.shinefiling.careers.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "jobs")
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String department;
    private String location;
    private String type; // Full-time, Part-time, etc.

    @Column(length = 5000)
    private String description;

    private boolean active = true;
    private LocalDateTime createdAt = LocalDateTime.now();
}
