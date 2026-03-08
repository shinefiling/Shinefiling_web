package com.shinefiling.common.repository;

import com.shinefiling.common.model.StatusLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StatusLogRepository extends JpaRepository<StatusLog, Long> {
    List<StatusLog> findByOrder_IdOrderByChangedAtDesc(Long orderId);
}
