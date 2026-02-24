package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CameraReadyTaskDTO {
    private String taskKey;
    private String taskLabel;
    private boolean completed;
    private LocalDateTime updatedAt;
}
