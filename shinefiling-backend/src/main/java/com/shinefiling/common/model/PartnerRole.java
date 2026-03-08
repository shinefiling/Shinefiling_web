package com.shinefiling.common.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "partner_roles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PartnerRole {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Boolean canView;
    private Boolean canApprove;
    private Boolean canFile;
}
