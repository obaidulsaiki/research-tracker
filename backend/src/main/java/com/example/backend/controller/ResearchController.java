package com.example.backend.controller;

import com.example.backend.dto.HistoryEntryDTO;
import com.example.backend.dto.ResearchDTO;
import com.example.backend.repository.ResearchRepo;
import com.example.backend.service.CsvService;
import com.example.backend.service.JournalService;
import com.example.backend.service.MetadataService;
import com.example.backend.service.ResearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/research")
@CrossOrigin(origins = "*")
public class ResearchController {

    @Autowired
    private ResearchService researchService;

    @Autowired
    private ResearchRepo researchRepo;

    @Autowired
    private CsvService csvService;

    @Autowired
    private MetadataService metadataService;

    @Autowired
    private JournalService journalService;

    @GetMapping("/journal-lookup")
    public ResponseEntity<?> lookupJournal(@RequestParam String name) {
        return journalService.lookup(name)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/check-duplicate")
    public ResponseEntity<Map<String, Boolean>> checkDuplicate(@RequestBody ResearchDTO dto) {
        String title = dto.getTitle();
        String pubName = dto.getPublication() != null ? dto.getPublication().getName() : null;
        String year = dto.getPublication() != null ? dto.getPublication().getYear() : null;

        boolean exists;
        if (dto.getId() != null) {
            exists = researchRepo.existsByTitleAndPublicationNameAndPublicationYearAndIdNot(title, pubName, year,
                    dto.getId());
        } else {
            exists = researchRepo.existsByTitleAndPublicationNameAndPublicationYear(title, pubName, year);
        }
        return ResponseEntity.ok(Map.of("exists", exists));
    }

    @GetMapping
    public List<ResearchDTO> getAll() {
        return researchService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResearchDTO> getById(@PathVariable Long id) {
        ResearchDTO r = researchService.getById(id);
        return r != null ? ResponseEntity.ok(r) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResearchDTO save(@RequestBody ResearchDTO research) {
        return researchService.save(research);
    }

    @PostMapping("/bulk")
    public List<ResearchDTO> saveAll(@RequestBody List<ResearchDTO> researches) {
        return researchService.saveAll(researches);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        researchService.delete(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/all")
    public ResponseEntity<Void> deleteAll() {
        researchService.deleteAll();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/analytics")
    public Map<String, Object> getAnalytics() {
        return researchService.getAnalytics();
    }

    @GetMapping("/fetch-metadata")
    public ResponseEntity<ResearchDTO> fetchMetadata(@RequestParam String doi) {
        ResearchDTO r = metadataService.fetchMetadataByDoiAsDTO(doi);
        return r != null ? ResponseEntity.ok(r) : ResponseEntity.notFound().build();
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> export() throws Exception {
        // CsvService might need update or we convert DTOs back to Entities for it
        // Let's assume CsvService is updated or we convert here
        byte[] data = csvService.exportToCsv(researchService.getAll());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=research_portfolio.csv")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(data);
    }

    @PostMapping("/import")
    public ResponseEntity<List<ResearchDTO>> importCsv(@RequestParam("file") MultipartFile file) throws Exception {
        List<ResearchDTO> imported = csvService.importFromCsv(file.getInputStream());
        List<ResearchDTO> saved = researchService.saveAll(imported);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/history")
    public List<HistoryEntryDTO> getHistory() {
        return researchService.getHistory();
    }
}
