package com.example.backend.service;

import com.example.backend.dto.HistoryEntryDTO;
import com.example.backend.dto.ResearchDTO;
import com.example.backend.entity.research.HistoryEntry;
import com.example.backend.entity.research.Research;
import com.example.backend.repository.AuthorRepo;
import com.example.backend.repository.HistoryEntryRepo;
import com.example.backend.repository.ResearchRepo;
import com.example.backend.mapper.ResearchMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
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

    @Autowired
    private ResearchMapper mapper;

    @Autowired
    private HistoryService historyService;

    @Autowired
    private AnalyticsService analyticsService;

    public List<ResearchDTO> getAll() {
        List<Research> allEntities = researchRepo.findAll();
        List<ResearchDTO> dtos = new java.util.ArrayList<>();
        for (Research r : allEntities) {
            dtos.add(mapper.convertToDTO(r));
        }
        return dtos;
    }

    public ResearchDTO getById(Long id) {
        Research r = researchRepo.findById(id).orElse(null);
        return r != null ? mapper.convertToDTO(r) : null;
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
            old = mapper.copyEntityState(entity);
            mapper.updateEntityFromDTO(entity, dto);
        } else {
            entity = mapper.convertToEntity(dto);
        }

        // Ensure bidirectional relationship is set for authors
        if (entity.getAuthors() != null) {
            entity.getAuthors().forEach(a -> a.setResearch(entity));
        }

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

    public Map<String, Object> getAnalytics() {
        return analyticsService.getAnalytics();
    }

    public List<HistoryEntryDTO> getHistory() {
        List<HistoryEntry> allHistory = historyEntryRepo.findAll();
        List<HistoryEntryDTO> dtos = new java.util.ArrayList<>();
        for (HistoryEntry h : allHistory) {
            dtos.add(mapper.convertToHistoryDTO(h));
        }
        return dtos;
    }
}
