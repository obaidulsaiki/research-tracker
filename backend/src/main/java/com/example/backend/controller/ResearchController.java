package com.example.backend.controller;

import com.example.backend.dto.HistoryEntryDTO;
import com.example.backend.dto.ResearchDTO;
import com.example.backend.repository.ResearchRepo;
import com.example.backend.service.CsvService;
import com.example.backend.service.JournalService;
import com.example.backend.service.MetadataService;
import com.example.backend.service.ExcelService;
import com.example.backend.service.PdfService;
import com.example.backend.service.ResearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/research")
@RequiredArgsConstructor
public class ResearchController {

    private final ResearchService researchService;
    private final ResearchRepo researchRepo;
    private final CsvService csvService;
    private final MetadataService metadataService;
    private final JournalService journalService;
    private final ExcelService excelService;
    private final PdfService pdfService;

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
        byte[] data = csvService.exportToCsv(researchService.getAll());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=research_portfolio.csv")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(data);
    }

    @GetMapping("/export/excel")
    public ResponseEntity<byte[]> exportExcel() throws Exception {
        byte[] data = excelService.exportToExcel(researchService.getAll());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=research_portfolio.xlsx")
                .contentType(
                        MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(data);
    }

    @GetMapping("/export/pdf")
    public ResponseEntity<byte[]> exportPdf() throws Exception {
        byte[] data = pdfService.exportToPdf(researchService.getAll());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=research_portfolio.pdf")
                .contentType(MediaType.APPLICATION_PDF)
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
