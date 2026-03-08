package com.shinefiling.common.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "admin_details")
public class AdminDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    private String department; // e.g., "Sales", "Support", "Legal"

    private String employeeId;

    private String accessLevel; // e.g., "L1", "L2", "Manager"
}
