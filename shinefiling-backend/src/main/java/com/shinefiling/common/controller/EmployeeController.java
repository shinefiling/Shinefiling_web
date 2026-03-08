package com.shinefiling.common.controller;

import com.shinefiling.common.model.ServiceRequest;
import com.shinefiling.common.model.User;
import com.shinefiling.common.repository.ServiceRequestRepository;
import com.shinefiling.common.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employee")
@CrossOrigin(origins = "http://localhost:5173")
public class EmployeeController {

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private UserRepository userRepository;

    // Get Assigned Tasks
    @GetMapping("/{employeeId}/tasks")
    public ResponseEntity<?> getAssignedTasks(@PathVariable Long employeeId) {
        User employee = userRepository.findById(employeeId).orElse(null);
        if (employee == null)
            return ResponseEntity.notFound().build();

        List<ServiceRequest> requests = serviceRequestRepository.findByAssignedEmployee(employee);
        return ResponseEntity.ok(requests);
    }

    // Update Task Status
    @PutMapping("/tasks/{requestId}/status")
    public ResponseEntity<?> updateTaskStatus(@PathVariable Long requestId, @RequestBody Map<String, String> payload) {
        ServiceRequest request = serviceRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        String status = payload.get("status"); // e.g., COMPLETED, WORK_IN_PROGRESS

        if ("COMPLETED".equalsIgnoreCase(status)) {
            request.setCaApprovalStatus("WORK_COMPLETED_BY_EMPLOYEE");
            // CA needs to review it now.
            request.setStatus("REVIEW_PENDING_CA");
        } else {
            request.setStatus(status);
        }

        serviceRequestRepository.save(request);
        return ResponseEntity.ok(Map.of("message", "Task status updated", "request", request));
    }
}
