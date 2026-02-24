package com.example.backend.controller;

import com.example.backend.entity.SystemSettings;

import com.example.backend.service.BackupService;
import com.example.backend.service.SettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SettingsController {

    private final SettingsService settingsService;
    private final BackupService backupService;

    @GetMapping
    public SystemSettings getSettings() {
        return settingsService.getSettings();
    }

    @PostMapping
    public SystemSettings updateSettings(@RequestBody SystemSettings newSettings) {
        return settingsService.updateSettings(newSettings);
    }

    @PostMapping("/trigger-backup")
    public void triggerBackup() {
        backupService.performBackup();
    }
}
