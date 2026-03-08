package com.shinefiling.common.repository;

import com.shinefiling.common.model.Commission;
import com.shinefiling.common.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommissionRepository extends JpaRepository<Commission, Long> {
    List<Commission> findByAgent(User agent);

    // Calculate total earnings
    // @Query("SELECT SUM(c.amount) FROM Commission c WHERE c.agent = :agent AND
    // c.status = 'PAID'")
    // Double sumPaidAmountByAgent(@Param("agent") User agent);
}
