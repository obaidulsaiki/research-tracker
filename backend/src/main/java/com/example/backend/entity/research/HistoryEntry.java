package com.example.backend.entity.research;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class HistoryEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime timestamp;
    private String changeType; // e.g., "STATUS_CHANGE", "VISIBILITY_CHANGE", "MAJOR_EDIT"

    private String oldValue;
    private String newValue;

    @ManyToOne
    @JoinColumn(name = "research_id")
    @JsonBackReference
    private Research research;
}
