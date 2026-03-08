package com.shinefiling.common.service;

import com.shinefiling.common.model.ServiceRequest;
import com.shinefiling.common.model.User;
import com.shinefiling.common.repository.ServiceRequestRepository;
import com.shinefiling.common.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiceRequestService {

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.shinefiling.common.repository.PaymentRepository paymentRepository;

    public ServiceRequest createRequest(String email, String serviceName, String formData) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ServiceRequest request = new ServiceRequest();
        request.setUser(user);
        request.setServiceName(serviceName);
        request.setFormData(formData);
        request.setStatus("PENDING");

        request = serviceRequestRepository.save(request);

        // Create initial Payment Record
        com.shinefiling.common.model.Payment payment = new com.shinefiling.common.model.Payment();
        payment.setUser(user);
        payment.setServiceRequest(request);
        // TODO: Integrate with ServiceProductRepository to fetch dynamic price
        payment.setAmount(1000.0);
        payment.setPaymentStatus("Pending");
        payment.setPaymentMethod("Online");

        paymentRepository.save(payment);

        // Automated Handover to Intelligent Agent - REMOVED per user request
        // if ("Rent Agreement".equalsIgnoreCase(serviceName)) {
        // request.setStatus("PROCESSING_AI");
        // serviceRequestRepository.save(request);
        // }

        return request;
    }

    public List<ServiceRequest> getKeyRequests(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return serviceRequestRepository.findByUser(user);
    }

    public List<ServiceRequest> getAllRequests() {
        return serviceRequestRepository.findAll();
    }

    public ServiceRequest assignAgent(Long requestId, Long agentId) {
        ServiceRequest request = serviceRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        User agent = userRepository.findById(agentId)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        request.setAssignedAgent(agent);
        request.setStatus("ASSIGNED");
        return serviceRequestRepository.save(request);
    }

    public List<ServiceRequest> getAgentRequests(String email) {
        // This is for External Agents (Partners) who submitted the request
        return serviceRequestRepository.findByAgentEmail(email);
    }

    @Autowired
    private CommissionService commissionService;

    public ServiceRequest updateStatus(Long requestId, String status) {
        ServiceRequest request = serviceRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        // Check if transitioning to COMPLETED
        if ("COMPLETED".equalsIgnoreCase(status) && !"COMPLETED".equalsIgnoreCase(request.getStatus())) {
            commissionService.processCommission(request);
        }

        request.setStatus(status);
        return serviceRequestRepository.save(request);
    }

    public List<ServiceRequest> getRequestsByService(String serviceName) {
        return serviceRequestRepository.findByServiceName(serviceName);
    }

    public List<ServiceRequest> getUserRequestsByService(String email, String serviceName) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return serviceRequestRepository.findByUserAndServiceName(user, serviceName);
    }

    public ServiceRequest submitApplication(String email, String serviceName, String formDataJson, String documentsJson,
            String plan, Double amount, String status) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User with email " + email + " not found"));

        ServiceRequest request = new ServiceRequest();
        request.setUser(user);
        request.setServiceName(serviceName);
        request.setFormData(formDataJson);
        request.setDocumentUrl(documentsJson);
        request.setPlan(plan);
        request.setAmount(amount);
        request.setStatus(status != null ? status : "PENDING");

        return serviceRequestRepository.save(request);
    }
}
