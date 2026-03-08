package com.shinefiling.common.repository;

import com.shinefiling.common.model.PartnerRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PartnerRoleRepository extends JpaRepository<PartnerRole, Long> {
}
