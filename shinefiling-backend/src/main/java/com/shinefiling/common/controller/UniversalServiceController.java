package com.shinefiling.common.controller;

import com.shinefiling.common.model.ServiceRequest;
import com.shinefiling.common.repository.ServiceRequestRepository;
import com.shinefiling.common.service.ServiceRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Universal Service Controller
 * Handles ALL service submissions from the frontend.
 * Route: /api/service/{servicePath}/apply
 * When user submits any order -> saved as ServiceRequest -> visible in Admin
 * Orders.
 */
@RestController
@RequestMapping("/api/service")
@CrossOrigin(origins = "http://localhost:5173")
public class UniversalServiceController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    /**
     * Universal apply endpoint - catches all service types.
     * e.g. POST /api/service/gst-registration/apply
     * POST /api/service/fssai-license/apply
     * POST /api/service/trademark/apply
     */
    @PostMapping("/{servicePath}/apply")
    public ResponseEntity<?> apply(
            @PathVariable String servicePath,
            @RequestBody Map<String, Object> requestBody) {
        try {
            // Extract user email from request body
            String email = getStringField(requestBody, "userEmail");
            if (email == null || email.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("message", "userEmail is required"));
            }

            // Derive a human-readable service name from the URL path
            String serviceName = pathToServiceName(servicePath);

            // Set status to INITIATED if not provided
            requestBody.putIfAbsent("status", "INITIATED");

            // Serialize the entire request body as form data
            String formDataStr = new com.fasterxml.jackson.databind.ObjectMapper()
                    .writeValueAsString(requestBody);

            // Create the ServiceRequest — this shows up in Admin Orders automatically
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, serviceName, formDataStr);

            // Set plan / amount / payment status
            String plan = getStringField(requestBody, "plan");
            Object amountPaid = requestBody.get("amountPaid");

            createdRequest.setPlan(plan != null ? plan : "standard");
            createdRequest.setAmount(amountPaid != null ? Double.parseDouble(amountPaid.toString()) : 0.0);
            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("INITIATED");

            serviceRequestRepository.save(createdRequest);

            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Also support POST /api/service/{servicePath} (without /apply suffix)
    @PostMapping("/{servicePath}")
    public ResponseEntity<?> applyDirect(
            @PathVariable String servicePath,
            @RequestBody Map<String, Object> requestBody) {
        return apply(servicePath, requestBody);
    }

    // Convert URL path to readable service name
    // e.g. "gst-registration" -> "GST Registration"
    // "fssai-license" -> "FSSAI License"
    private String pathToServiceName(String path) {
        if (path == null)
            return "Service";
        String[] words = path.split("[-_]");
        StringBuilder sb = new StringBuilder();
        for (String word : words) {
            if (!word.isEmpty()) {
                // Common known acronyms
                String upper = word.toUpperCase();
                if (upper.matches("GST|FSSAI|IEC|DSC|DIN|LLP|PF|ESI|ROC|TDS|ITR|NDA|PAN|TAN|MOA|AOA|LWF")) {
                    sb.append(upper);
                } else {
                    sb.append(Character.toUpperCase(word.charAt(0)))
                            .append(word.substring(1).toLowerCase());
                }
                sb.append(" ");
            }
        }
        return sb.toString().trim();
    }

    private String getStringField(Map<String, Object> body, String key) {
        Object val = body.get(key);
        return val != null ? val.toString() : null;
    }
}
