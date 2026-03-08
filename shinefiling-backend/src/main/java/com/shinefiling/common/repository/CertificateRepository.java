package com.shinefiling.common.repository;

import com.shinefiling.common.model.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    List<Certificate> findByServiceRequestId(Long serviceRequestId);
}
