package com.shinefiling.common.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "stored_files")
public class StoredFile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName; // Unique system name
    private String originalFileName;
    private String contentType;
    private Long size;
    private String url; // Access URL
    private String filePath; // Physical path on server

    private LocalDateTime uploadedAt = LocalDateTime.now();

    // Optional: Link to user who uploaded
    private String uploadedBy;

    private String category; // e.g., "client_docs", "chats", "certificates"
}
