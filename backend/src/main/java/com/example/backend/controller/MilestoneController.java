package com.example.backend.controller;

import com.example.backend.dto.CameraReadyTaskDTO;
import com.example.backend.service.ChecklistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/research")
@RequiredArgsConstructor
public class MilestoneController {

    private final ChecklistService checklistService;

    @GetMapping("/{id}/checklist")
    public ResponseEntity<List<CameraReadyTaskDTO>> getChecklist(@PathVariable Long id) {
        return ResponseEntity.ok(checklistService.getChecklist(id));
    }

    @PatchMapping("/{id}/checklist/{taskKey}")
    public ResponseEntity<CameraReadyTaskDTO> toggleTask(
            @PathVariable Long id,
            @PathVariable String taskKey,
            @RequestBody Map<String, Boolean> payload) {
        boolean completed = payload.getOrDefault("completed", false);
        return ResponseEntity.ok(checklistService.toggleTask(id, taskKey, completed));
    }
}
