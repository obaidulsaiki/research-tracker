package com.example.backend.controller;

import com.example.backend.entity.SystemSettings;
import com.example.backend.repository.SystemSettingsRepo;
import com.example.backend.service.BackupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "*")
public class SettingsController {

    @Autowired
    private SystemSettingsRepo settingsRepo;

    @Autowired
    private BackupService backupService;

    @GetMapping
    public SystemSettings getSettings() {
        return settingsRepo.getSettings();
    }

    @PostMapping
    public SystemSettings updateSettings(@RequestBody SystemSettings newSettings) {
        SystemSettings existing = settingsRepo.getSettings();
        existing.setAutoBackupEnabled(newSettings.isAutoBackupEnabled());
        existing.setBackupIntervalHours(newSettings.getBackupIntervalHours());
        existing.setDailyResearchGoal(newSettings.getDailyResearchGoal());
        // lastBackupTime is managed by the service
        return settingsRepo.save(existing);
    }

    @PostMapping("/trigger-backup")
    public void triggerBackup() {
        backupService.performBackup();
    }
}
