package com.shinefiling.common.repository;

import com.shinefiling.common.model.PartnerPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PartnerPlanRepository extends JpaRepository<PartnerPlan, Long> {
}
