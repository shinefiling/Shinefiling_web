package com.shinefiling.common.repository;

import com.shinefiling.common.model.JobLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobLogRepository extends JpaRepository<JobLog, Long> {
    List<JobLog> findByAutomationJobIdOrderByTimestampDesc(Long automationJobId);

    List<JobLog> findByAutomationJobId(Long automationJobId);
}
