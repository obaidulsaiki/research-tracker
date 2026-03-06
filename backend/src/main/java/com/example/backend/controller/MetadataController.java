package com.example.backend.controller;

import com.example.backend.dto.ConferenceMetadataDTO;
import com.example.backend.dto.JournalMetadataDTO;
import com.example.backend.service.JournalService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/metadata")
@RequiredArgsConstructor
public class MetadataController {

    private final JournalService journalService;

    @GetMapping("/journals")
    public List<JournalMetadataDTO> getAllJournals() {
        return journalService.getAllJournals();
    }

    @GetMapping("/conferences")
    public List<ConferenceMetadataDTO> getAllConferences() {
        return journalService.getAllConferences();
    }
}
