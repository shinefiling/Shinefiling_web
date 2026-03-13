package com.shinefiling.common.service;

import com.shinefiling.common.model.Commission;
import com.shinefiling.common.model.ServiceRequest;
import com.shinefiling.common.repository.CommissionRepository;
import com.shinefiling.common.repository.TransactionRepository;
import com.shinefiling.common.repository.UserRepository;
import com.shinefiling.common.model.User;
import com.shinefiling.common.model.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class CommissionService {

    @Autowired
    private CommissionRepository commissionRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    public void processCommission(ServiceRequest request) {
        if (request.getAssignedAgent() != null) {
            Commission commission = new Commission();
            commission.setAgent(request.getAssignedAgent());
            commission.setServiceRequest(request);

            Double amount = request.getAmount() != null ? request.getAmount() : 0.0;
            Double commissionAmount = amount * 0.10; // 10% Flat

            commission.setAmount(commissionAmount);
            commission.setStatus("PENDING");
            commission.setCreatedAt(LocalDateTime.now());

            commissionRepository.save(commission);
            System.out.println("Commission processed for Agent: " + request.getAssignedAgent().getEmail());
        }

        // Handle CA Payout
        if (request.getAssignedCa() != null) {
            processCaPayout(request);
        }
    }

    public void processCaPayout(ServiceRequest request) {
        User ca = request.getAssignedCa();
        if (ca == null) return;

        java.math.BigDecimal amount = java.math.BigDecimal.valueOf(request.getBoundAmount() != null ? request.getBoundAmount() : 0.0);

        // Update Balance
        ca.setWalletBalance(ca.getWalletBalance().add(amount));
        userRepository.save(ca);

        // Create Transaction Record
        Transaction txn = new Transaction();
        txn.setUser(ca);
        txn.setType("CREDIT");
        txn.setAmount(amount);
        txn.setDescription("Earning for " + request.getServiceName() + " (Order #" + request.getId() + ")");
        txn.setStatus("SUCCESS");
        txn.setReferenceId(request.getId());
        txn.setReferenceType("SERVICE_REQUEST");
        transactionRepository.save(txn);

        System.out.println("Wallet Balance updated for CA: " + ca.getEmail());
    }
}
