package com.example.backend.controller;

import com.example.backend.entity.ConferenceDeadline;
import com.example.backend.service.DeadlineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deadlines")
@RequiredArgsConstructor
public class DeadlineController {

    private final DeadlineService service;

    @GetMapping
    public List<ConferenceDeadline> getAll() {
        return service.getAllDeadlines();
    }

    @PostMapping
    public ResponseEntity<ConferenceDeadline> save(@RequestBody ConferenceDeadline deadline) {
        ConferenceDeadline saved = service.saveDeadline(deadline);
        if (saved == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteDeadline(id);
        return ResponseEntity.ok().build();
    }
}
