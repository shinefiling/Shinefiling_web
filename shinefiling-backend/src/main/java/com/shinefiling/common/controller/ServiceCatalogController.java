package com.shinefiling.common.controller;

import com.shinefiling.common.model.ServiceCatalog;
import com.shinefiling.common.repository.ServiceCatalogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/catalog")
@CrossOrigin(origins = "*")
public class ServiceCatalogController {
    @Autowired
    private ServiceCatalogRepository repo;

    @GetMapping
    public List<ServiceCatalog> getCatalog() {
        return repo.findAll();
    }
}
