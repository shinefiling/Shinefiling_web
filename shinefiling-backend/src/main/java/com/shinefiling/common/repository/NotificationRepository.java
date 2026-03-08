package com.shinefiling.common.repository;

import com.shinefiling.common.model.Notification;
import com.shinefiling.common.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserOrderByCreatedAtDesc(User user);

    // Find system-wide notifications (for admins) where user is null, or maybe we
    // assign admin notifs to a specific admin user?
    // Better strategy: Admin notifications are assigned to users with role
    // ADMIN/MASTER_ADMIN.
    // Or we explicitly fetch notifications where (user is null) for global admin
    // alerts.
    List<Notification> findByUserIsNullOrderByCreatedAtDesc();

    List<Notification> findByUserOrUserIsNullOrderByCreatedAtDesc(User user);

    long countByUserAndIsReadFalse(User user);

    List<Notification> findByUserIsNullAndIsReadFalseOrderByCreatedAtDesc();

    List<Notification> findByReferenceId(String referenceId);
}
