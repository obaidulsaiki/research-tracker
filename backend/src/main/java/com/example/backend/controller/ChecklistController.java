package com.example.backend.controller;

import com.example.backend.dto.CameraReadyTaskDTO;
import com.example.backend.service.ChecklistService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/checklist")
@RequiredArgsConstructor
public class ChecklistController {

    private final ChecklistService checklistService;

    @PostMapping("/{researchId}/toggle")
    public CameraReadyTaskDTO toggleTask(
            @PathVariable Long researchId,
            @RequestParam String taskKey,
            @RequestParam boolean completed) {
        return checklistService.toggleTask(researchId, taskKey, completed);
    }
}
