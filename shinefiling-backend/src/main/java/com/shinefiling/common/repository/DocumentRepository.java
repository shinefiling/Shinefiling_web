package com.shinefiling.common.repository;

import com.shinefiling.common.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByServiceRequestId(Long serviceRequestId);
}
