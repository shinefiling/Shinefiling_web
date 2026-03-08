package com.shinefiling.common.service;

import com.shinefiling.common.model.AuditLog;
import com.shinefiling.common.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditLogService {

    @Autowired
    private AuditLogRepository repository;

    public void log(String severity, String type, String action, String user, String details, String resource) {
        AuditLog log = new AuditLog();
        log.setEventType(type + "_" + action); // e.g. USER_ACTION_LOGIN
        log.setActor(user);

        // Create simple JSON payload from legacy fields
        String json = String.format("{\"severity\":\"%s\", \"details\":\"%s\", \"resource\":\"%s\"}",
                severity, details != null ? details.replace("\"", "'") : "", resource);
        log.setPayloadJson(json);

        repository.save(log);
    }

    public void logEvent(Long serviceRequestId, String eventType, String actor, String payloadJson) {
        AuditLog log = new AuditLog();
        log.setServiceRequestId(serviceRequestId);
        log.setEventType(eventType);
        log.setActor(actor);
        log.setPayloadJson(payloadJson);
        repository.save(log);
    }

    public List<AuditLog> getAllLogs() {
        return repository.findAllByOrderByTimestampDesc();
    }
}
