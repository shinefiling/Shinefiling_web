package com.shinefiling.common.controller;

import com.shinefiling.common.model.FirewallLog;
import com.shinefiling.common.repository.FirewallRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/firewall")
@CrossOrigin(origins = "http://localhost:5173")
public class FirewallController {

    @Autowired
    private FirewallRepository firewallRepository;

    @GetMapping("/logs")
    public ResponseEntity<?> getLogs() {
        List<FirewallLog> logs = firewallRepository.findTop100ByOrderByTimestampDesc();
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        long rateLimited = firewallRepository.countByBlockReason("RATE_LIMIT");
        long wafAttacks = firewallRepository.countByBlockReason("WAF_ATTACK");
        long totalBlocked = rateLimited + wafAttacks;

        Map<String, Long> stats = new HashMap<>();
        stats.put("rateLimited", rateLimited);
        stats.put("wafAttacks", wafAttacks);
        stats.put("totalBlocked", totalBlocked);

        return ResponseEntity.ok(stats);
    }
}
