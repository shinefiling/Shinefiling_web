package com.shinefiling.common.repository;

import com.shinefiling.common.model.CaBid;
import com.shinefiling.common.model.ServiceRequest;
import com.shinefiling.common.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CaBidRepository extends JpaRepository<CaBid, Long> {
    List<CaBid> findByServiceRequest(ServiceRequest serviceRequest);

    List<CaBid> findByCa(User ca);

    Optional<CaBid> findByServiceRequestAndCa(ServiceRequest serviceRequest, User ca);

    List<CaBid> findByServiceRequestId(Long requestId);
}
