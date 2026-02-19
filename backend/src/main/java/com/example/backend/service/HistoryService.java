package com.example.backend.service;

import com.example.backend.entity.research.HistoryEntry;
import com.example.backend.entity.research.Publication;
import com.example.backend.entity.research.Research;
import com.example.backend.repository.HistoryEntryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Service
public class HistoryService {

    @Autowired
    private HistoryEntryRepo historyEntryRepo;

    @Transactional
    public void logHistory(Research research, String type, String oldVal, String newVal) {
        HistoryEntry entry = new HistoryEntry();
        entry.setResearch(research);
        entry.setTimestamp(LocalDateTime.now());
        entry.setChangeType(type);
        entry.setOldValue(oldVal);
        entry.setNewValue(newVal);

        if (research != null) {
            if (research.getHistoryEntries() == null) {
                research.setHistoryEntries(new ArrayList<>());
            }
            research.getHistoryEntries().add(entry);
        }

        historyEntryRepo.save(entry);
    }

    public void logFieldChanges(Research old, Research saved) {
        // Status
        if (!eq(old.getStatus(), saved.getStatus()))
            logHistory(saved, "STATUS_CHANGE", str(old.getStatus()), str(saved.getStatus()));
        // Visibility
        if (!eq(old.getPublicVisibility(), saved.getPublicVisibility()))
            logHistory(saved, "VISIBILITY_CHANGE", str(old.getPublicVisibility()), str(saved.getPublicVisibility()));
        // Title
        if (!eq(old.getTitle(), saved.getTitle()))
            logHistory(saved, "TITLE_CHANGE", old.getTitle(), saved.getTitle());
        // Featured
        if (old.isFeatured() != saved.isFeatured())
            logHistory(saved, "FEATURED_CHANGE", String.valueOf(old.isFeatured()), String.valueOf(saved.isFeatured()));
        // Notes
        if (!eq(old.getNotes(), saved.getNotes()))
            logHistory(saved, "NOTES_CHANGE", old.getNotes(), saved.getNotes());
        // Overleaf URL
        if (!eq(old.getOverleafUrl(), saved.getOverleafUrl()))
            logHistory(saved, "OVERLEAF_URL_CHANGE", old.getOverleafUrl(), saved.getOverleafUrl());
        // Drive URL
        if (!eq(old.getDriveUrl(), saved.getDriveUrl()))
            logHistory(saved, "DRIVE_URL_CHANGE", old.getDriveUrl(), saved.getDriveUrl());
        // Dataset URL
        if (!eq(old.getDatasetUrl(), saved.getDatasetUrl()))
            logHistory(saved, "DATASET_URL_CHANGE", old.getDatasetUrl(), saved.getDatasetUrl());
        // Submission Date
        if (!eq(old.getSubmissionDate(), saved.getSubmissionDate()))
            logHistory(saved, "SUBMISSION_DATE_CHANGE", str(old.getSubmissionDate()), str(saved.getSubmissionDate()));
        // Decision Date
        if (!eq(old.getDecisionDate(), saved.getDecisionDate()))
            logHistory(saved, "DECISION_DATE_CHANGE", str(old.getDecisionDate()), str(saved.getDecisionDate()));
        // Publication Date
        if (!eq(old.getPublicationDate(), saved.getPublicationDate()))
            logHistory(saved, "PUBLICATION_DATE_CHANGE", str(old.getPublicationDate()),
                    str(saved.getPublicationDate()));

        // Publication fields
        Publication oldPub = old.getPublication();
        Publication newPub = saved.getPublication();
        if (oldPub != null || newPub != null) {
            String oldName = oldPub != null ? oldPub.getName() : null;
            String newName = newPub != null ? newPub.getName() : null;
            if (!eq(oldName, newName))
                logHistory(saved, "PUBLICATION_NAME_CHANGE", oldName, newName);

            String oldType = oldPub != null ? str(oldPub.getType()) : null;
            String newType = newPub != null ? str(newPub.getType()) : null;
            if (!eq(oldType, newType))
                logHistory(saved, "PUBLICATION_TYPE_CHANGE", oldType, newType);

            String oldYear = oldPub != null ? oldPub.getYear() : null;
            String newYear = newPub != null ? newPub.getYear() : null;
            if (!eq(oldYear, newYear))
                logHistory(saved, "PUBLICATION_YEAR_CHANGE", oldYear, newYear);

            String oldQ = oldPub != null ? str(oldPub.getQuartile()) : null;
            String newQ = newPub != null ? str(newPub.getQuartile()) : null;
            if (!eq(oldQ, newQ))
                logHistory(saved, "QUARTILE_CHANGE", oldQ, newQ);

            String oldIF = oldPub != null ? oldPub.getImpactFactor() : null;
            String newIF = newPub != null ? newPub.getImpactFactor() : null;
            if (!eq(oldIF, newIF))
                logHistory(saved, "IMPACT_FACTOR_CHANGE", oldIF, newIF);

            String oldPub2 = oldPub != null ? oldPub.getPublisher() : null;
            String newPub2 = newPub != null ? newPub.getPublisher() : null;
            if (!eq(oldPub2, newPub2))
                logHistory(saved, "PUBLISHER_CHANGE", oldPub2, newPub2);

            String oldVenue = oldPub != null ? oldPub.getVenue() : null;
            String newVenue = newPub != null ? newPub.getVenue() : null;
            if (!eq(oldVenue, newVenue))
                logHistory(saved, "VENUE_CHANGE", oldVenue, newVenue);
        }
    }

    private boolean eq(Object a, Object b) {
        if (a == null && b == null)
            return true;
        if (a == null || b == null)
            return false;
        return a.equals(b);
    }

    private String str(Object o) {
        return o != null ? o.toString() : null;
    }
}
