package com.shinefiling.common.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "client_details")
public class ClientDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // One-to-One mapping with User
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    private String companyName;

    private String gstNumber;

    private String address;

    private String panNumber;

    private String aadhaarNumber;
}
