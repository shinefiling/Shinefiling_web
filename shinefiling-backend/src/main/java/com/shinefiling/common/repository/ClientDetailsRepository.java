package com.shinefiling.common.repository;

import com.shinefiling.common.model.ClientDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ClientDetailsRepository extends JpaRepository<ClientDetails, Long> {
    Optional<ClientDetails> findByUserId(Long userId);
}
