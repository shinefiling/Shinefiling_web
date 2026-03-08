package com.shinefiling.common.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "service_products")
public class ServiceProduct {
    @Id
    private String id;
    private String name;
    private String category;
    private String categoryId;
    private Double price;
    private String sla;
    private Integer docsRequired;
    private String status; // ACTIVE, INACTIVE
    private String color;

    public ServiceProduct() {
    }

    public ServiceProduct(String id, String name, String category, String categoryId, Double price, String sla,
            Integer docsRequired, String status, String color) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.categoryId = categoryId;
        this.price = price;
        this.sla = sla;
        this.docsRequired = docsRequired;
        this.status = status;
        this.color = color;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getSla() {
        return sla;
    }

    public void setSla(String sla) {
        this.sla = sla;
    }

    public Integer getDocsRequired() {
        return docsRequired;
    }

    public void setDocsRequired(Integer docsRequired) {
        this.docsRequired = docsRequired;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
