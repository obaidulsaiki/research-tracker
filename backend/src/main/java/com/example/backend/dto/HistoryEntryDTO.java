package com.example.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class HistoryEntryDTO {
    private Long id;
    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;
    private String changeType;
    private String oldValue;
    private String newValue;
    private Long researchId;
    private String fieldName;
}
