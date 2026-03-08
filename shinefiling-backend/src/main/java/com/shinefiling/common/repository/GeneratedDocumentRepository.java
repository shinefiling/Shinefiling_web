package com.shinefiling.common.repository;

import com.shinefiling.common.model.GeneratedDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GeneratedDocumentRepository extends JpaRepository<GeneratedDocument, Long> {
    List<GeneratedDocument> findByOrder_Id(Long orderId);
}
