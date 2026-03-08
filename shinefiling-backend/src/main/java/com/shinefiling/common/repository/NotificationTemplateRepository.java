package com.shinefiling.common.repository;

import com.shinefiling.common.model.NotificationTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationTemplateRepository extends JpaRepository<NotificationTemplate, Long> {
    List<NotificationTemplate> findByType(String type);
}
