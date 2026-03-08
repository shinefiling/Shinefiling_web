package com.shinefiling.common.repository;

import com.shinefiling.common.model.AdminDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AdminDetailsRepository extends JpaRepository<AdminDetails, Long> {
    Optional<AdminDetails> findByUserId(Long userId);
}
