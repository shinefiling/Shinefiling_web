package com.shinefiling.common.repository;

import com.shinefiling.common.model.Transaction;
import com.shinefiling.common.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUser(User user);
    List<Transaction> findByUserOrderByCreatedAtDesc(User user);
    List<Transaction> findByStatusAndReferenceType(String status, String referenceType);
}
