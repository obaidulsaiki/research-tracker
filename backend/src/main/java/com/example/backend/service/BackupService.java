package com.example.backend.service;

import com.example.backend.dto.ResearchDTO;
import com.example.backend.entity.SystemSettings;
import com.example.backend.repository.SystemSettingsRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BackupService {

    @Autowired
    private CsvService csvService;

    @Autowired
    private ResearchService researchService;

    @Autowired
    private SystemSettingsRepo settingsRepo;

    private static final String BACKUP_DIR = "backups";
    private static final String BACKUP_FILE = "research_tracker_backup.csv";

    // Run every 10 minutes to check if backup is due
    @Scheduled(fixedRate = 10 * 60 * 1000)
    public void checkAndBackup() {
        SystemSettings settings = settingsRepo.getSettings();
        if (!settings.isAutoBackupEnabled())
            return;

        LocalDateTime last = settings.getLastBackupTime();
        LocalDateTime now = LocalDateTime.now();

        if (last == null || last.plusHours(settings.getBackupIntervalHours()).isBefore(now)) {
            performBackup(settings);
        }
    }

    public void performBackup() {
        performBackup(settingsRepo.getSettings());
    }

    private synchronized void performBackup(SystemSettings settings) {
        try {
            List<ResearchDTO> allRecords = researchService.getAll();
            byte[] csvData = csvService.exportToCsv(allRecords);

            Path dirPath = Paths.get(BACKUP_DIR);
            if (!Files.exists(dirPath)) {
                Files.createDirectories(dirPath);
            }

            File file = new File(BACKUP_DIR + "/" + BACKUP_FILE);
            // Overwrite existing file
            try (FileOutputStream fos = new FileOutputStream(file)) {
                fos.write(csvData);
            }

            settings.setLastBackupTime(LocalDateTime.now());
            settingsRepo.save(settings);

            System.out.println("AUTO-BACKUP: Successfully saved to " + file.getAbsolutePath());
        } catch (Exception e) {
            System.err.println("AUTO-BACKUP ERROR: " + e.getMessage());
        }
    }
}
