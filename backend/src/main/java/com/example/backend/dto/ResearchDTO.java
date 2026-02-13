package com.example.backend.dto;

import com.example.backend.entity.research.Status;
import com.example.backend.entity.research.PaperType;
import com.example.backend.entity.research.JournalQuartile;
import com.example.backend.entity.research.PublicVisibility;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
public class ResearchDTO {
    private Long id;
    private Status status;
    private int pid;
    private String title;
    private PaperType paperType;
    private int authorPlace;
    private List<AuthorDTO> authors = new ArrayList<>();
    private String publisherName;
    private String publisherYear;
    private JournalQuartile journalQuartile;
    private String paperUrl;
    private String overleafUrl;
    private String driveUrl;
    private String datasetUrl;
    private PublicVisibility publicVisibility;
    private List<String> tags = new ArrayList<>();
    private boolean featured;
    private String notes;
    private LocalDate submissionDate;
    private LocalDate decisionDate;
    private LocalDate publicationDate;
}
