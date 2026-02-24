package com.example.backend.service;

import com.example.backend.dto.CameraReadyTaskDTO;
import com.example.backend.entity.CameraReadyTask;
import com.example.backend.repository.CameraReadyTaskRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChecklistService {

    private final CameraReadyTaskRepo checklistRepo;

    public List<CameraReadyTaskDTO> getChecklist(Long researchId) {
        List<CameraReadyTask> tasks = checklistRepo.findAllByResearchId(researchId);

        // Auto-initialize if empty (Default 7 tasks)
        if (tasks.isEmpty()) {
            return initializeChecklist(researchId);
        }

        return tasks.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Transactional
    public List<CameraReadyTaskDTO> initializeChecklist(Long researchId) {
        log.info("CHECKLIST SERVICE: Initializing default tasks for research ID: {}", researchId);

        List<CameraReadyTask> defaults = Arrays.asList(
                createTask(researchId, "CAMERA_READY", "Camera ready Paper"),
                createTask(researchId, "COPYRIGHT", "Copywrite document"),
                createTask(researchId, "VALIDATION", "Validate paper for IEEE xplore or Others"),
                createTask(researchId, "PAYMENT", "Payment"),
                createTask(researchId, "RESPONSE", "Response"),
                createTask(researchId, "OTHER_DOCS", "Other Documents (Student / IEEE card)"));

        return checklistRepo.saveAll(defaults).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public CameraReadyTaskDTO toggleTask(Long researchId, String taskKey, boolean completed) {
        List<CameraReadyTask> tasks = checklistRepo.findAllByResearchId(researchId);
        CameraReadyTask task = tasks.stream()
                .filter(t -> t.getTaskKey().equals(taskKey))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Task not found: " + taskKey));

        task.setCompleted(completed);
        return convertToDTO(checklistRepo.save(task));
    }

    private CameraReadyTask createTask(Long resId, String key, String label) {
        return CameraReadyTask.builder()
                .researchId(resId)
                .taskKey(key)
                .taskLabel(label)
                .completed(false)
                .build();
    }

    private CameraReadyTaskDTO convertToDTO(CameraReadyTask task) {
        return CameraReadyTaskDTO.builder()
                .taskKey(task.getTaskKey())
                .taskLabel(task.getTaskLabel())
                .completed(task.isCompleted())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}
