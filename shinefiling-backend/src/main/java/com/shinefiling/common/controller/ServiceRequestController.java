package com.shinefiling.common.controller;

import com.shinefiling.common.model.ServiceRequest;
import com.shinefiling.common.service.ServiceRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * ServiceRequest Controller - Cleaned Version
 * Handles standardized ServiceRequest operations.
 * All module-specific logic has been removed.
 */
@RestController
@RequestMapping("/api/services")
public class ServiceRequestController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    @PostMapping("/apply")
    public ResponseEntity<?> applyForService(@RequestBody Map<String, Object> payload) {
        String email = (String) payload.get("email");
        String serviceName = (String) payload.get("serviceName");

        String formData = "";
        if (payload.get("formData") != null) {
            formData = payload.get("formData").toString();
        }

        try {
            ServiceRequest request = serviceRequestService.createRequest(email, serviceName, formData);
            return ResponseEntity.ok(request);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/my-requests")
    public ResponseEntity<?> getUserRequests(@RequestParam String email) {
        try {
            List<ServiceRequest> standardRequests = serviceRequestService.getKeyRequests(email);
            List<Map<String, Object>> result = new ArrayList<>();

            for (ServiceRequest r : standardRequests) {
                Map<String, Object> map = new HashMap<>();
                map.put("id", r.getId());
                map.put("serviceName", r.getServiceName());
                map.put("status", r.getStatus());
                map.put("createdAt", r.getCreatedAt());
                map.put("user", r.getUser());
                map.put("submissionId", "ORD-" + r.getId());

                // Generic Details
                map.put("amountPaid", r.getAmount());
                map.put("businessType", "Service Request");
                map.put("applicantName", r.getUser() != null ? r.getUser().getFullName() : "");
                map.put("businessName", r.getServiceName());

                // Frontend Compatibility Keys
                map.put("client", r.getUser() != null ? r.getUser().getFullName() : "Unknown");
                map.put("service", r.getServiceName());
                map.put("email", r.getUser() != null ? r.getUser().getEmail() : "");
                map.put("mobile", r.getUser() != null ? r.getUser().getMobile() : "");
                map.put("amount", r.getAmount());
                map.put("formData", r.getFormData());

                result.add(map);
            }

            result.sort((a, b) -> {
                String d1 = a.get("createdAt") != null ? a.get("createdAt").toString() : "";
                String d2 = b.get("createdAt") != null ? b.get("createdAt").toString() : "";
                return d2.compareTo(d1);
            });

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllRequests() {
        try {
            List<Map<String, Object>> result = new ArrayList<>();
            List<ServiceRequest> standardRequests = serviceRequestService.getAllRequests();

            for (ServiceRequest r : standardRequests) {
                Map<String, Object> map = new HashMap<>();
                map.put("id", r.getId());
                map.put("serviceName", r.getServiceName());
                map.put("status", r.getStatus());
                map.put("createdAt", r.getCreatedAt());
                map.put("user", r.getUser());
                map.put("submissionId", "ORD-" + r.getId());
                map.put("amountPaid", r.getAmount());

                // Frontend Compatibility
                map.put("client", r.getUser() != null ? r.getUser().getFullName() : "Unknown");
                map.put("service", r.getServiceName());
                map.put("email", r.getUser() != null ? r.getUser().getEmail() : "");
                map.put("mobile", r.getUser() != null ? r.getUser().getMobile() : "");
                map.put("amount", r.getAmount());

                if (r.getFormData() != null && !r.getFormData().isEmpty()) {
                    try {
                        map.put("formData", objectMapper.readValue(r.getFormData(), Map.class));
                    } catch (Exception e) {
                        map.put("formData", r.getFormData());
                    }
                }

                result.add(map);
            }

            result.sort((a, b) -> {
                String d1 = a.get("createdAt") != null ? a.get("createdAt").toString() : "";
                String d2 = b.get("createdAt") != null ? b.get("createdAt").toString() : "";
                return d2.compareTo(d1);
            });

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Collections.singletonMap("message", e.getMessage()));
        }
    }

    @GetMapping("/agent-requests")
    public ResponseEntity<?> getAgentRequests(@RequestParam String email) {
        try {
            List<ServiceRequest> requests = serviceRequestService.getAgentRequests(email);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/assign")
    public ResponseEntity<?> assignAgent(@PathVariable Long id, @RequestBody Map<String, Long> payload) {
        try {
            Long agentId = payload.get("agentId");
            ServiceRequest request = serviceRequestService.assignAgent(id, agentId);
            return ResponseEntity.ok(request);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        try {
            return ResponseEntity.ok(serviceRequestService.updateStatus(id, status));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
