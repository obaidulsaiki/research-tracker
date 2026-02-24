package com.example.backend.service;

import com.example.backend.entity.SystemSettings;
import com.example.backend.repository.SystemSettingsRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SettingsService {

    private final SystemSettingsRepo settingsRepo;

    @Transactional
    public SystemSettings getSettings() {
        return settingsRepo.findAll().stream().findFirst().orElseGet(() -> {
            SystemSettings s = new SystemSettings();
            return settingsRepo.save(s);
        });
    }

    @Transactional
    public SystemSettings updateSettings(SystemSettings newSettings) {
        SystemSettings existing = getSettings();
        existing.setAutoBackupEnabled(newSettings.isAutoBackupEnabled());
        existing.setBackupIntervalHours(newSettings.getBackupIntervalHours());
        return settingsRepo.save(existing);
    }

}
