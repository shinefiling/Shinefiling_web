package com.shinefiling.common.repository;

import com.shinefiling.common.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByUserId(Long userId);

    List<Payment> findByServiceRequestId(Long serviceRequestId);
}
