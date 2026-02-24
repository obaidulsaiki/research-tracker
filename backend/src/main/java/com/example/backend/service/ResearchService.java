package com.example.backend.service;

import com.example.backend.dto.HistoryEntryDTO;
import com.example.backend.dto.ResearchDTO;
import com.example.backend.entity.Conference;
import com.example.backend.entity.research.HistoryEntry;
import com.example.backend.entity.research.Research;
import com.example.backend.repository.ConferenceRepo;
import com.example.backend.repository.HistoryEntryRepo;
import com.example.backend.repository.ResearchRepo;
import com.example.backend.mapper.ResearchMapper;
import com.example.backend.service.validation.ResearchValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResearchService {

    private final ResearchRepo researchRepo;
    private final ConferenceRepo conferenceRepo;
    private final HistoryEntryRepo historyEntryRepo;
    private final ResearchMapper mapper;
    private final HistoryService historyService;
    private final AnalyticsService analyticsService;
    private final AuthorService authorService;
    private final ResearchValidator validator;
    private final ChecklistService checklistService;

    public List<ResearchDTO> getAll() {
        return researchRepo.findAll().stream()
                .map(r -> {
                    return mapper.convertToDTO(r);
                })
                .collect(Collectors.toList());
    }

    public ResearchDTO getById(Long id) {
        return researchRepo.findById(id)
                .map(r -> {
                    ResearchDTO dto = mapper.convertToDTO(r);
                    dto.setChecklist(checklistService.getChecklist(r.getId()));
                    return dto;
                })
                .orElse(null);
    }

    @Transactional
    public ResearchDTO save(ResearchDTO dto) {
        validator.validateUniqueness(dto);

        Research entity;
        Research old = null;

        if (dto.getId() != null) {
            entity = researchRepo.findById(dto.getId())
                    .orElseThrow(() -> new RuntimeException("Research record not found with ID: " + dto.getId()));
            old = mapper.copyEntityState(entity);
            mapper.updateEntityFromDTO(entity, dto);
        } else {
            entity = mapper.convertToEntity(dto);
        }

        // AUTO-LINK CONFERENCE BY NAME
        // Only attempt auto-linking if this is a NEW record, OR if the publication name
        // changed
        // to a known conference. We shouldn't auto-link if the user explicitly unlinked
        // it.
        boolean shouldAutoLink = entity.getConference() == null &&
                entity.getPublication() != null &&
                entity.getPublication().getName() != null &&
                !entity.getPublication().getName().isBlank();

        if (shouldAutoLink) {
            String pubName = entity.getPublication().getName();
            String pubYear = entity.getPublication().getYear();

            // Try match by Short Name first (e.g. NeurIPS)
            List<Conference> matches = conferenceRepo.findByShortNameIgnoreCase(pubName);
            // If no short name match, try Full Name (e.g. "International Conference on...")
            if (matches.isEmpty()) {
                matches = conferenceRepo.findByNameIgnoreCase(pubName);
            }

            if (!matches.isEmpty()) {
                // If we found matches, try to find one with a matching year
                Conference bestMatch = matches.get(0);
                if (pubYear != null) {
                    for (Conference m : matches) {
                        if (pubYear.equals(m.getYear())) {
                            bestMatch = m;
                            break;
                        }
                    }
                }
                entity.setConference(bestMatch);
                // Also update the other side of the relationship if possible
                if (bestMatch.getPapers() != null && !bestMatch.getPapers().contains(entity)) {
                    bestMatch.getPapers().add(entity);
                }
                log.info("AUTO-LINK: Linked paper '{}' to conference '{} {}' (ID: {})",
                        entity.getTitle(), bestMatch.getName(), bestMatch.getYear(), bestMatch.getId());
            } else {
                log.debug("AUTO-LINK: No matching conference for publication '{}'", pubName);
            }
        }

        authorService.resolveAuthorsForResearch(entity);

        Research saved = researchRepo.save(entity);

        if (old != null) {
            historyService.logFieldChanges(old, saved);
        } else {
            historyService.logHistory(saved, "CREATED", null, saved.getTitle());
        }

        return mapper.convertToDTO(saved);
    }

    @Transactional
    public List<ResearchDTO> saveAll(List<ResearchDTO> dtos) {
        return dtos.stream().map(this::save).collect(Collectors.toList());
    }

    @Transactional
    public void delete(Long id) {
        researchRepo.findById(id).ifPresent(r -> {
            HistoryEntry deletedEntry = new HistoryEntry();
            deletedEntry.setTimestamp(LocalDateTime.now());
            deletedEntry.setChangeType("DELETED");
            deletedEntry.setOldValue(r.getTitle());
            deletedEntry.setNewValue("Record permanently deleted");
            deletedEntry.setResearch(null);
            historyEntryRepo.save(deletedEntry);

            if (r.getAuthors() != null) {
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
        historyEntryRepo.deleteAll();
        researchRepo.deleteAll();
    }

    public Map<String, Object> getAnalytics() {
        return analyticsService.getAnalytics();
    }

    public List<HistoryEntryDTO> getHistory() {
        return historyEntryRepo.findAll().stream()
                .map(mapper::convertToHistoryDTO)
                .collect(Collectors.toList());
    }
}
