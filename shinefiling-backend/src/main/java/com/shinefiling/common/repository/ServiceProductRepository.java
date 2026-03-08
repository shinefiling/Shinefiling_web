package com.shinefiling.common.repository;

import com.shinefiling.common.model.ServiceProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceProductRepository extends JpaRepository<ServiceProduct, String> {
}
