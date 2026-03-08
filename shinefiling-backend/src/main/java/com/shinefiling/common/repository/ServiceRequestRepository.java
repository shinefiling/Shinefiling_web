package com.shinefiling.common.repository;

import com.shinefiling.common.model.ServiceRequest;
import com.shinefiling.common.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {
    List<ServiceRequest> findByUser(User user);

    List<ServiceRequest> findByStatus(String status);

    List<ServiceRequest> findByAssignedAgent(User agent);

    List<ServiceRequest> findByServiceName(String serviceName);

    List<ServiceRequest> findByUserAndServiceName(User user, String serviceName);

    List<ServiceRequest> findByAgentEmail(String agentEmail);

    List<ServiceRequest> findByAssignedCa(User ca);

    List<ServiceRequest> findByAssignedEmployee(User employee);

    List<ServiceRequest> findByBiddingStatus(String biddingStatus);
}
