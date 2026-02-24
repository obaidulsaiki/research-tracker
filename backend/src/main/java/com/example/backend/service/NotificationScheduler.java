package com.example.backend.service;

import com.example.backend.entity.Conference;
import com.example.backend.entity.research.Research;
import com.example.backend.repository.ConferenceRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationScheduler {

    private final ConferenceRepo conferenceRepo;

    // Checks every day at midnight (or any regular interval)
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional(readOnly = true)
    public void checkMilestones() {
        log.info("NOTIFICATION SCHEDULER: Checking daily milestones...");
        java.time.LocalDate today = java.time.LocalDate.now();

        List<Conference> allConferences = conferenceRepo.findAll();

        for (Conference conf : allConferences) {
            checkAndNotify(conf, "Submission Deadline", conf.getSubmissionDeadline(), today);
            checkAndNotify(conf, "Notification Date", conf.getNotificationDate(), today);
            checkAndNotify(conf, "Camera-Ready Deadline", conf.getCameraReadyDeadline(), today);
            checkAndNotify(conf, "Registration Deadline", conf.getRegistrationDeadline(), today);
            checkAndNotify(conf, "Conference Date", conf.getConferenceDate(), today);
        }
    }

    private void checkAndNotify(Conference conf, String type, java.time.LocalDate milestoneDate,
            java.time.LocalDate today) {
        if (milestoneDate == null)
            return;

        // If the milestone is happening today
        if (milestoneDate.equals(today)) {
            String confName = conf.getShortName() != null ? conf.getShortName() : "Unknown Conference";

            String paperTitles = "No linked papers";
            if (conf.getPapers() != null && !conf.getPapers().isEmpty()) {
                paperTitles = conf.getPapers().stream()
                        .map(Research::getTitle)
                        .collect(Collectors.joining(", "));
            }

            log.warn(
                    "🚨 MILESTONE ALERT: Papers [{}] for {} Conference — today is the {}. Please check the submission portal ({}).",
                    paperTitles, confName, type, conf.getPlatformName() != null ? conf.getPlatformName() : "Portal");
        }
    }
}
