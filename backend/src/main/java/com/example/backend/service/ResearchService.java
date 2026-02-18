package com.example.backend.service;

import com.example.backend.dto.AuthorDTO;
import com.example.backend.dto.HistoryEntryDTO;
import com.example.backend.dto.PublicationDTO;
import com.example.backend.dto.ResearchDTO;
import com.example.backend.entity.research.Author;
import com.example.backend.entity.research.Publication;
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
        String title = dto.getTitle();
        String pubName = dto.getPublication() != null ? dto.getPublication().getName() : null;
        String year = dto.getPublication() != null ? dto.getPublication().getYear() : null;

        if (dto.getId() != null) {
            boolean exists = researchRepo.existsByTitleAndPublicationNameAndPublicationYearAndIdNot(title, pubName,
                    year,
                    dto.getId());
            if (exists) {
                throw new RuntimeException("A record with this Title, Publication, and Year already exists.");
            }
        } else if (researchRepo.existsByTitleAndPublicationNameAndPublicationYear(title, pubName, year)) {
            throw new RuntimeException("A record with this Title, Publication, and Year already exists.");
        }

        Research entity;
        Research old = null;

        if (dto.getId() != null) {
            entity = researchRepo.findById(dto.getId())
                    .orElseThrow(() -> new RuntimeException("Research record not found with ID: " + dto.getId()));
            old = copyEntityState(entity); // Helper to track changes for history
            updateEntityFromDTO(entity, dto);
        } else {
            entity = convertToEntity(dto);
        }

        // Ensure bidirectional relationship is set for authors
        if (entity.getAuthors() != null) {
            entity.getAuthors().forEach(a -> a.setResearch(entity));
        }

        Research saved = researchRepo.save(entity);

        if (old != null) {
            logFieldChanges(old, saved);
        } else {
            logHistory(saved, "CREATED", null, saved.getTitle());
        }

        return convertToDTO(saved);
    }

    private Research copyEntityState(Research original) {
        Research copy = new Research();
        copy.setStatus(original.getStatus());
        copy.setPublicVisibility(original.getPublicVisibility());
        copy.setTitle(original.getTitle());
        copy.setFeatured(original.isFeatured());
        copy.setNotes(original.getNotes());
        copy.setOverleafUrl(original.getOverleafUrl());
        copy.setDriveUrl(original.getDriveUrl());
        copy.setDatasetUrl(original.getDatasetUrl());
        copy.setTags(original.getTags() != null ? new ArrayList<>(original.getTags()) : null);
        copy.setSubmissionDate(original.getSubmissionDate());
        copy.setDecisionDate(original.getDecisionDate());
        copy.setPublicationDate(original.getPublicationDate());
        if (original.getPublication() != null) {
            Publication pub = new Publication();
            pub.setName(original.getPublication().getName());
            pub.setType(original.getPublication().getType());
            pub.setYear(original.getPublication().getYear());
            pub.setQuartile(original.getPublication().getQuartile());
            pub.setImpactFactor(original.getPublication().getImpactFactor());
            pub.setPublisher(original.getPublication().getPublisher());
            pub.setVenue(original.getPublication().getVenue());
            copy.setPublication(pub);
        }
        return copy;
    }

    private void logFieldChanges(Research old, Research saved) {
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

    private void updateEntityFromDTO(Research entity, ResearchDTO dto) {
        entity.setStatus(dto.getStatus());
        entity.setPid(dto.getPid());
        entity.setTitle(dto.getTitle());
        entity.setAuthorPlace(dto.getAuthorPlace());

        // Update Authors (Complex merge)
        if (dto.getAuthors() != null) {
            // Simple replace for now but with orphan removal support
            entity.getAuthors().clear();
            entity.getAuthors().addAll(dto.getAuthors().stream()
                    .map(this::convertToAuthorEntity)
                    .collect(Collectors.toList()));
        }

        // Update Publication
        if (dto.getPublication() != null) {
            if (entity.getPublication() == null) {
                entity.setPublication(convertToPublicationEntity(dto.getPublication()));
            } else {
                updatePublicationFromDTO(entity.getPublication(), dto.getPublication());
            }
        }

        entity.setPaperUrl(dto.getPaperUrl());
        entity.setOverleafUrl(dto.getOverleafUrl());
        entity.setDriveUrl(dto.getDriveUrl());
        entity.setDatasetUrl(dto.getDatasetUrl());
        entity.setPublicVisibility(dto.getPublicVisibility());
        entity.setTags(dto.getTags());
        entity.setFeatured(dto.isFeatured());
        entity.setAbstractText(dto.getAbstractText());
        entity.setNotes(dto.getNotes());
        entity.setSubmissionDate(dto.getSubmissionDate());
        entity.setDecisionDate(dto.getDecisionDate());
        entity.setPublicationDate(dto.getPublicationDate());
    }

    private void updatePublicationFromDTO(Publication entity, PublicationDTO dto) {
        entity.setType(dto.getType());
        entity.setName(dto.getName());
        entity.setPublisher(dto.getPublisher());
        entity.setYear(dto.getYear());
        entity.setVenue(dto.getVenue());
        entity.setImpactFactor(dto.getImpactFactor());
        entity.setQuartile(dto.getQuartile());
        entity.setUrl(dto.getUrl());
    }

    @Transactional
    public List<ResearchDTO> saveAll(List<ResearchDTO> dtos) {
        return dtos.stream().map(this::save).collect(Collectors.toList());
    }

    @Transactional
    public void delete(Long id) {
        researchRepo.findById(id).ifPresent(r -> {
            // Log DELETED event BEFORE removing — save directly with null research FK
            HistoryEntry deletedEntry = new HistoryEntry();
            deletedEntry.setTimestamp(LocalDateTime.now());
            deletedEntry.setChangeType("DELETED");
            deletedEntry.setOldValue(r.getTitle());
            deletedEntry.setNewValue("Record permanently deleted");
            deletedEntry.setResearch(null); // Detached — survives the delete
            historyEntryRepo.save(deletedEntry);

            // Now remove children and the record
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
                all.stream()
                        .collect(Collectors.groupingBy(
                                r -> (r.getPublication() != null && r.getPublication().getType() != null)
                                        ? r.getPublication().getType()
                                        : "ARTICLE",
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
        // Type mapping removed as it's now internal to Publication
        dto.setAuthorPlace(r.getAuthorPlace());
        dto.setAuthors(r.getAuthors().stream().map(this::convertToAuthorDTO).collect(Collectors.toList()));
        if (r.getPublication() != null) {
            dto.setPublication(convertToPublicationDTO(r.getPublication()));
        }
        dto.setPaperUrl(r.getPaperUrl());
        dto.setOverleafUrl(r.getOverleafUrl());
        dto.setDriveUrl(r.getDriveUrl());
        dto.setDatasetUrl(r.getDatasetUrl());
        dto.setPublicVisibility(r.getPublicVisibility());
        dto.setTags(r.getTags());
        dto.setFeatured(r.isFeatured());
        dto.setAbstractText(r.getAbstractText());
        dto.setNotes(r.getNotes());
        dto.setSubmissionDate(r.getSubmissionDate());
        dto.setDecisionDate(r.getDecisionDate());
        dto.setPublicationDate(r.getPublicationDate());
        return dto;
    }

    private PublicationDTO convertToPublicationDTO(Publication p) {
        PublicationDTO dto = new PublicationDTO();
        dto.setId(p.getId());
        dto.setType(p.getType());
        dto.setName(p.getName());
        dto.setPublisher(p.getPublisher());
        dto.setYear(p.getYear());
        dto.setVenue(p.getVenue());
        dto.setImpactFactor(p.getImpactFactor());
        dto.setQuartile(p.getQuartile());
        dto.setUrl(p.getUrl());
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

        // Derive human-readable field name from change type
        String type = h.getChangeType() != null ? h.getChangeType() : "";
        String fieldName = switch (type) {
            case "STATUS_CHANGE" -> "Status";
            case "VISIBILITY_CHANGE" -> "Visibility";
            case "TITLE_CHANGE" -> "Title";
            case "FEATURED_CHANGE" -> "Featured";
            case "NOTES_CHANGE" -> "Notes";
            case "OVERLEAF_URL_CHANGE" -> "Overleaf URL";
            case "DRIVE_URL_CHANGE" -> "Drive URL";
            case "DATASET_URL_CHANGE" -> "Dataset URL";
            case "SUBMISSION_DATE_CHANGE" -> "Submission Date";
            case "DECISION_DATE_CHANGE" -> "Decision Date";
            case "PUBLICATION_DATE_CHANGE" -> "Publication Date";
            case "PUBLICATION_NAME_CHANGE" -> "Publication Name";
            case "PUBLICATION_TYPE_CHANGE" -> "Publication Type";
            case "PUBLICATION_YEAR_CHANGE" -> "Publication Year";
            case "QUARTILE_CHANGE" -> "Quartile";
            case "IMPACT_FACTOR_CHANGE" -> "Impact Factor";
            case "PUBLISHER_CHANGE" -> "Publisher";
            case "VENUE_CHANGE" -> "Venue";
            case "CREATED" -> "New Record";
            case "DELETED" -> "Deleted Record";
            default -> type.replace("_", " ").toLowerCase();
        };
        dto.setFieldName(fieldName);

        return dto;
    }

    private Research convertToEntity(ResearchDTO dto) {
        Research r = new Research();
        r.setId(dto.getId());
        r.setStatus(dto.getStatus());
        r.setPid(dto.getPid());
        r.setTitle(dto.getTitle());
        // Type mapping removed as it's now internal to Publication
        r.setAuthorPlace(dto.getAuthorPlace());
        if (dto.getAuthors() != null) {
            r.setAuthors(dto.getAuthors().stream().map(this::convertToAuthorEntity).collect(Collectors.toList()));
        }
        if (dto.getPublication() != null) {
            r.setPublication(convertToPublicationEntity(dto.getPublication()));
        }
        r.setPaperUrl(dto.getPaperUrl());
        r.setOverleafUrl(dto.getOverleafUrl());
        r.setDriveUrl(dto.getDriveUrl());
        r.setDatasetUrl(dto.getDatasetUrl());
        r.setPublicVisibility(dto.getPublicVisibility());
        r.setTags(dto.getTags());
        r.setFeatured(dto.isFeatured());
        r.setAbstractText(dto.getAbstractText());
        r.setNotes(dto.getNotes());
        r.setSubmissionDate(dto.getSubmissionDate());
        r.setDecisionDate(dto.getDecisionDate());
        r.setPublicationDate(dto.getPublicationDate());
        return r;
    }

    private Publication convertToPublicationEntity(PublicationDTO dto) {
        Publication p = new Publication();
        p.setId(dto.getId());
        p.setType(dto.getType());
        p.setName(dto.getName());
        p.setPublisher(dto.getPublisher());
        p.setYear(dto.getYear());
        p.setVenue(dto.getVenue());
        p.setImpactFactor(dto.getImpactFactor());
        p.setQuartile(dto.getQuartile());
        p.setUrl(dto.getUrl());
        return p;
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
