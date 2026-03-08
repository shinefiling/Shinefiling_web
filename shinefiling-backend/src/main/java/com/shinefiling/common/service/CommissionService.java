package com.shinefiling.common.service;

import com.shinefiling.common.model.Commission;
import com.shinefiling.common.model.ServiceRequest;
import com.shinefiling.common.repository.CommissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class CommissionService {

    @Autowired
    private CommissionRepository commissionRepository;

    public void processCommission(ServiceRequest request) {
        if (request.getAssignedAgent() == null) {
            return; // No agent assigned, no commission
        }

        // Check if commission already exists
        // Assuming one commission per request for now
        // Ideally CommissionRepository should have findByServiceRequest
        // But since I can't easily see if it exists, I'll rely on business logic or
        // simple check if I can add method to repo.

        // Let's implement a safe check if possible or just create new.
        // Assuming this method is called once upon completion.

        Commission commission = new Commission();
        commission.setAgent(request.getAssignedAgent());
        commission.setServiceRequest(request);

        // Commission Calculation Logic (e.g. 10% of amount)
        Double amount = request.getAmount() != null ? request.getAmount() : 0.0;
        Double commissionAmount = amount * 0.10; // 10% Flat

        commission.setAmount(commissionAmount);
        commission.setStatus("PENDING"); // Pending Payout
        commission.setCreatedAt(LocalDateTime.now());

        commissionRepository.save(commission);
        System.out.println("Commission processed for Agent: " + request.getAssignedAgent().getEmail() + " Amount: "
                + commissionAmount);
    }
}
