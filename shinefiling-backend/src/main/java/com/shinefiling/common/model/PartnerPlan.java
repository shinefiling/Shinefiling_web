package com.shinefiling.common.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "partner_plans")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PartnerPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String applicationLimit;
    private Double price;
}
