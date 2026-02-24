package com.example.backend.controller;

import com.example.backend.dto.ConferenceDTO;
import com.example.backend.service.ConferenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conferences")
@RequiredArgsConstructor
public class ConferenceController {

    private final ConferenceService conferenceService;

    @GetMapping
    public ResponseEntity<List<ConferenceDTO>> getAllConferences() {
        return ResponseEntity.ok(conferenceService.getAllConferences());
    }

    @PostMapping
    public ResponseEntity<ConferenceDTO> createConference(@RequestBody ConferenceDTO dto) {
        return ResponseEntity.ok(conferenceService.createConference(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ConferenceDTO> updateConference(@PathVariable Long id, @RequestBody ConferenceDTO dto) {
        return ResponseEntity.ok(conferenceService.updateConference(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConference(@PathVariable Long id) {
        conferenceService.deleteConference(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/sync")
    public ResponseEntity<String> syncPapers() {
        conferenceService.syncAllExistingData();
        return ResponseEntity.ok("Sync completed successfully");
    }
}
