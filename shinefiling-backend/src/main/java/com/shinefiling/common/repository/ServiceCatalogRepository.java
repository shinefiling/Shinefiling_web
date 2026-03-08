package com.shinefiling.common.repository;

import com.shinefiling.common.model.ServiceCatalog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceCatalogRepository extends JpaRepository<ServiceCatalog, Long> {
    ServiceCatalog findByCategory(String category);
}
