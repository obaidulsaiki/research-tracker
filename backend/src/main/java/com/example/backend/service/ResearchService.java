package com.example.backend.service;

import com.example.backend.dto.AuthorDTO;
import com.example.backend.dto.HistoryEntryDTO;
import com.example.backend.dto.ResearchDTO;
import com.example.backend.entity.research.Author;
import com.example.backend.entity.research.HistoryEntry;
import com.example.backend.entity.research.Research;
import com.example.backend.repository.AuthorRepo;
import com.example.backend.repository.HistoryEntryRepo;
import com.example.backend.repository.ResearchRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ResearchService {

    @Autowired
    private ResearchRepo researchRepo;

    @Autowired
    private HistoryEntryRepo historyEntryRepo;

    @Autowired
    private AuthorRepo authorRepo;

    public List<ResearchDTO> getAll() {
        return researchRepo.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ResearchDTO getById(Long id) {
        Research r = researchRepo.findById(id).orElse(null);
        return r != null ? convertToDTO(r) : null;
    }

    @Transactional
    public ResearchDTO save(ResearchDTO dto) {
        Research entity = convertToEntity(dto);
        Research old = dto.getId() != null ? researchRepo.findById(dto.getId()).orElse(null) : null;

        // Ensure bidirectional relationship is set for database persistence
        if (entity.getAuthors() != null) {
            entity.getAuthors().forEach(a -> a.setResearch(entity));
        }

        Research saved = researchRepo.save(entity);

        if (old != null) {
            if (old.getStatus() != saved.getStatus()) {
                logHistory(saved, "STATUS_CHANGE", String.valueOf(old.getStatus()), String.valueOf(saved.getStatus()));
            }
            if (old.getPublicVisibility() != saved.getPublicVisibility()) {
                logHistory(saved, "VISIBILITY_CHANGE", String.valueOf(old.getPublicVisibility()),
                        String.valueOf(saved.getPublicVisibility()));
            }
        } else {
            logHistory(saved, "CREATED", null, "Initial record created");
        }

        return convertToDTO(saved);
    }

    @Transactional
    public List<ResearchDTO> saveAll(List<ResearchDTO> dtos) {
        return dtos.stream().map(this::save).collect(Collectors.toList());
    }

    @Transactional
    public void delete(Long id) {
        researchRepo.findById(id).ifPresent(r -> {
            // Manually clear children to satisfy DB constraints
            if (r.getAuthors() != null) {
                authorRepo.deleteAll(r.getAuthors());
                r.getAuthors().clear();
            }
            if (r.getHistoryEntries() != null) {
                historyEntryRepo.deleteAll(r.getHistoryEntries());
                r.getHistoryEntries().clear();
            }
            researchRepo.delete(r);
        });
    }

    @Transactional
    public void deleteAll() {
        authorRepo.deleteAll();
        historyEntryRepo.deleteAll();
        researchRepo.deleteAll();
    }

    private void logHistory(Research research, String type, String oldVal, String newVal) {
        HistoryEntry entry = new HistoryEntry();
        entry.setResearch(research);
        entry.setTimestamp(LocalDateTime.now());
        entry.setChangeType(type);
        entry.setOldValue(oldVal);
        entry.setNewValue(newVal);

        // Maintain bidirectional relationship
        if (research.getHistoryEntries() == null) {
            research.setHistoryEntries(new ArrayList<>());
        }
        research.getHistoryEntries().add(entry);

        historyEntryRepo.save(entry);
    }

    public Map<String, Object> getAnalytics() {
        List<Research> all = researchRepo.findAll();
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalCount", all.size());
        stats.put("papersByType",
                all.stream().collect(Collectors.groupingBy(r -> r.getPaperType() != null ? r.getPaperType() : "ARTICLE",
                        Collectors.counting())));
        stats.put("papersByStatus",
                all.stream().collect(Collectors.groupingBy(r -> r.getStatus() != null ? r.getStatus() : "WORKING",
                        Collectors.counting())));
        stats.put("publicCount",
                all.stream()
                        .filter(r -> r.getPublicVisibility() != null && "PUBLIC".equals(r.getPublicVisibility().name()))
                        .count());
        stats.put("privateCount",
                all.stream().filter(
                        r -> r.getPublicVisibility() == null || "PRIVATE".equals(r.getPublicVisibility().name()))
                        .count());
        stats.put("featuredCount", all.stream().filter(Research::isFeatured).count());

        return stats;
    }

    public List<HistoryEntryDTO> getHistory() {
        return historyEntryRepo.findAll().stream()
                .map(this::convertToHistoryDTO)
                .collect(Collectors.toList());
    }

    // Mapping logic
    private ResearchDTO convertToDTO(Research r) {
        ResearchDTO dto = new ResearchDTO();
        dto.setId(r.getId());
        dto.setStatus(r.getStatus());
        dto.setPid(r.getPid());
        dto.setTitle(r.getTitle());
        dto.setPaperType(r.getPaperType());
        dto.setAuthorPlace(r.getAuthorPlace());
        dto.setAuthors(r.getAuthors().stream().map(this::convertToAuthorDTO).collect(Collectors.toList()));
        dto.setPublisherName(r.getPublisherName());
        dto.setPublisherYear(r.getPublisherYear());
        dto.setJournalQuartile(r.getJournalQuartile());
        dto.setPaperUrl(r.getPaperUrl());
        dto.setOverleafUrl(r.getOverleafUrl());
        dto.setDriveUrl(r.getDriveUrl());
        dto.setDatasetUrl(r.getDatasetUrl());
        dto.setPublicVisibility(r.getPublicVisibility());
        dto.setTags(r.getTags());
        dto.setFeatured(r.isFeatured());
        dto.setNotes(r.getNotes());
        dto.setSubmissionDate(r.getSubmissionDate());
        dto.setDecisionDate(r.getDecisionDate());
        dto.setPublicationDate(r.getPublicationDate());
        return dto;
    }

    private AuthorDTO convertToAuthorDTO(Author a) {
        AuthorDTO dto = new AuthorDTO();
        dto.setId(a.getId());
        dto.setName(a.getName());
        dto.setRole(a.getRole());
        dto.setContributionPercentage(a.getContributionPercentage());
        return dto;
    }

    private HistoryEntryDTO convertToHistoryDTO(HistoryEntry h) {
        HistoryEntryDTO dto = new HistoryEntryDTO();
        dto.setId(h.getId());
        dto.setTimestamp(h.getTimestamp());
        dto.setChangeType(h.getChangeType());
        dto.setOldValue(h.getOldValue());
        dto.setNewValue(h.getNewValue());

        if (h.getResearch() != null) {
            dto.setResearchId(h.getResearch().getId());
        }

        // Derive field name from change type
        String type = h.getChangeType();
        if (type != null) {
            if (type.contains("STATUS"))
                dto.setFieldName("Status");
            else if (type.contains("VISIBILITY"))
                dto.setFieldName("Visibility");
            else if (type.contains("EDIT"))
                dto.setFieldName("Content");
            else
                dto.setFieldName("Record");
        }

        return dto;
    }

    private Research convertToEntity(ResearchDTO dto) {
        Research r = new Research();
        r.setId(dto.getId());
        r.setStatus(dto.getStatus());
        r.setPid(dto.getPid());
        r.setTitle(dto.getTitle());
        r.setPaperType(dto.getPaperType());
        r.setAuthorPlace(dto.getAuthorPlace());
        if (dto.getAuthors() != null) {
            r.setAuthors(dto.getAuthors().stream().map(this::convertToAuthorEntity).collect(Collectors.toList()));
        }
        r.setPublisherName(dto.getPublisherName());
        r.setPublisherYear(dto.getPublisherYear());
        r.setJournalQuartile(dto.getJournalQuartile());
        r.setPaperUrl(dto.getPaperUrl());
        r.setOverleafUrl(dto.getOverleafUrl());
        r.setDriveUrl(dto.getDriveUrl());
        r.setDatasetUrl(dto.getDatasetUrl());
        r.setPublicVisibility(dto.getPublicVisibility());
        r.setTags(dto.getTags());
        r.setFeatured(dto.isFeatured());
        r.setNotes(dto.getNotes());
        r.setSubmissionDate(dto.getSubmissionDate());
        r.setDecisionDate(dto.getDecisionDate());
        r.setPublicationDate(dto.getPublicationDate());
        return r;
    }

    private Author convertToAuthorEntity(AuthorDTO dto) {
        Author a = new Author();
        a.setId(dto.getId());
        a.setName(dto.getName());
        a.setRole(dto.getRole());
        a.setContributionPercentage(dto.getContributionPercentage());
        return a;
    }
}
