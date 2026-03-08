package com.shinefiling.common.controller;

import com.shinefiling.common.model.Commission;
import com.shinefiling.common.model.User;
import com.shinefiling.common.repository.CommissionRepository;
import com.shinefiling.common.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/agent")
@CrossOrigin(origins = "http://localhost:5173")
public class AgentController {

    @Autowired
    private CommissionRepository commissionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.shinefiling.common.repository.ServiceRequestRepository serviceRequestRepository;

    @GetMapping("/applications")
    public ResponseEntity<?> getAgentApplications(@RequestParam String email) {
        // Find requests by exact agent email
        List<com.shinefiling.common.model.ServiceRequest> byEmail = serviceRequestRepository.findByAgentEmail(email);

        // Also find by User entity if exists
        User agent = userRepository.findByEmail(email).orElse(null);
        if (agent != null) {
            List<com.shinefiling.common.model.ServiceRequest> byUser = serviceRequestRepository
                    .findByAssignedAgent(agent);
            byEmail.addAll(byUser);
        }

        return ResponseEntity.ok(byEmail.stream().distinct().toList());
    }

    @GetMapping("/{agentId}/commissions")
    public ResponseEntity<?> getCommissions(@PathVariable Long agentId) {
        User agent = userRepository.findById(agentId).orElse(null);
        if (agent == null)
            return ResponseEntity.notFound().build();

        List<Commission> commissions = commissionRepository.findByAgent(agent);
        return ResponseEntity.ok(commissions);
    }

    @GetMapping("/{agentId}/stats")
    public ResponseEntity<?> getStats(@PathVariable Long agentId) {
        User agent = userRepository.findById(agentId).orElse(null);
        if (agent == null)
            return ResponseEntity.notFound().build();

        List<Commission> commissions = commissionRepository.findByAgent(agent);

        double totalEarnings = commissions.stream()
                .mapToDouble(Commission::getAmount)
                .sum();

        double pending = commissions.stream()
                .filter(c -> "PENDING".equalsIgnoreCase(c.getStatus()))
                .mapToDouble(Commission::getAmount)
                .sum();

        double paid = commissions.stream()
                .filter(c -> "PAID".equalsIgnoreCase(c.getStatus()))
                .mapToDouble(Commission::getAmount)
                .sum();

        return ResponseEntity.ok(Map.of(
                "totalEarnings", totalEarnings,
                "pendingPayout", pending,
                "paidPayout", paid,
                "totalCommissions", commissions.size()));
    }

    @PostMapping("/{agentId}/withdraw")
    public ResponseEntity<?> withdraw(@PathVariable Long agentId, @RequestBody Map<String, Double> payload) {
        User agent = userRepository.findById(agentId).orElse(null);
        if (agent == null)
            return ResponseEntity.notFound().build();

        Double amount = payload.get("amount");

        return ResponseEntity.ok(Map.of("success", true, "message", "Withdrawal request submitted for " + amount));
    }
}
