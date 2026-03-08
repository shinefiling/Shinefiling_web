package com.shinefiling.common.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api")
public class StubController {

    @GetMapping({
            "/fssai/my-requests",
            "/trade-license/my-applications",
            "/factory-license/my-applications",
            "/fire-noc/my-applications",
            "/iec/my-applications",
            "/bar-liquor/my-applications",
            "/shop-establishment/my-applications",
            "/labour-license/my-applications",
            "/drug-license/my-applications",
            "/pollution-control/my-applications",
            "/gumastha-license/my-applications",

            "/trademark-registration/my-applications",
            "/trademark-objection/my-applications",
            "/trademark-hearing/my-applications",
            "/trademark-assignment/my-applications",
            "/trademark-renewal/my-applications",
            "/copyright-registration/my-applications",
            "/patent-filing/my-applications",
            "/design-registration/my-applications",

            "/pf-registration/my-applications",
            "/esi-registration/my-applications",
            "/professional-tax/my-applications",
            "/labour-welfare-fund/my-applications",
            "/gratuity-act/my-applications",
            "/bonus-act/my-applications",
            "/minimum-wages/my-applications",

            // Also stub the service/* ones just in case they aren't implemented

            "/service/partnership-deed/my-applications",
            "/service/founders-agreement/my-applications",
            "/service/shareholders-agreement/my-applications",
            "/service/employment-agreement/my-applications",
            "/service/rent-agreement/my-applications",
            "/service/franchise-agreement/my-applications",
            "/service/nda/my-applications",
            "/service/vendor-agreement/my-applications",

            "/service/bank-loan-documentation/my-applications",
            "/service/cash-flow-compliance/my-applications",
            "/service/business-valuation/my-applications",

            "/service/one-person-company/my-applications",
            "/service/llp/my-applications",
            "/service/partnership-firm/my-applications",
            "/service/sole-proprietorship/my-applications",
            "/service/section-8-company/my-applications",
            "/service/nidhi-company/my-applications",
            "/service/producer-company/my-applications",
            "/service/public-limited-company/my-applications"
    })
    public ResponseEntity<List<Object>> getEmptyApplications() {
        return ResponseEntity.ok(Collections.emptyList());
    }
}
