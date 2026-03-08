package com.shinefiling.common.repository;

import com.shinefiling.common.model.ComplianceRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ComplianceRuleRepository extends JpaRepository<ComplianceRule, Long> {
}
