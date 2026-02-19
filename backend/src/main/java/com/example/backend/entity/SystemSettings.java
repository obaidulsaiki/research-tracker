package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "system_settings")
@Data
public class SystemSettings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private boolean autoBackupEnabled = false;
    private int backupIntervalHours = 24; // Default to 24h
    private LocalDateTime lastBackupTime;
}
