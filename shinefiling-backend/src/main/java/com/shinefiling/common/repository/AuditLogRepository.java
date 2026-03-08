package com.shinefiling.common.repository;

import com.shinefiling.common.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findAllByOrderByTimestampDesc();

    List<AuditLog> findByServiceRequestId(Long serviceRequestId);
}
