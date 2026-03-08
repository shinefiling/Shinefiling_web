package com.shinefiling.common.repository;

import com.shinefiling.common.model.FirewallLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FirewallRepository extends JpaRepository<FirewallLog, Long> {
    List<FirewallLog> findTop100ByOrderByTimestampDesc();

    long countByBlockReason(String reason);
}
