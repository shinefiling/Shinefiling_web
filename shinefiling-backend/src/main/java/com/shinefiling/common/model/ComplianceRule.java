package com.shinefiling.common.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "compliance_rules")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComplianceRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;
    private String frequency;
    private String dueDateDays;
    private String penaltyMetrics;
}
