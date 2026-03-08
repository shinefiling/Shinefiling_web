package com.shinefiling.common.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
@Table(name = "service_catalog")
public class ServiceCatalog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String category;
    private String categoryTitle;
    private String color;

    @ElementCollection
    private List<String> services;

    public ServiceCatalog() {
    }

    public ServiceCatalog(String category, String categoryTitle, String color, List<String> services) {
        this.category = category;
        this.categoryTitle = categoryTitle;
        this.color = color;
        this.services = services;
    }
}
