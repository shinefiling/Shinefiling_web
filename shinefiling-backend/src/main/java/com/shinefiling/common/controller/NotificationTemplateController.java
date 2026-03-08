package com.shinefiling.common.controller;

import com.shinefiling.common.model.NotificationTemplate;
import com.shinefiling.common.repository.NotificationTemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/templates")
@CrossOrigin(origins = "*")
public class NotificationTemplateController {

    @Autowired
    private NotificationTemplateRepository repository;

    @GetMapping
    public List<NotificationTemplate> getAllTemplates() {
        return repository.findAll();
    }

    @PostMapping
    public NotificationTemplate createTemplate(@RequestBody NotificationTemplate template) {
        template.setUpdatedAt(LocalDateTime.now());
        return repository.save(template);
    }

    @PutMapping("/{id}")
    public NotificationTemplate updateTemplate(@PathVariable Long id, @RequestBody NotificationTemplate details) {
        return repository.findById(id).map(t -> {
            t.setName(details.getName());
            t.setType(details.getType());
            t.setSubject(details.getSubject());
            t.setBody(details.getBody());
            t.setVariables(details.getVariables());
            t.setActive(details.isActive());
            t.setUpdatedAt(LocalDateTime.now());
            return repository.save(t);
        }).orElseThrow(() -> new RuntimeException("Template not found"));
    }

    @DeleteMapping("/{id}")
    public void deleteTemplate(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
