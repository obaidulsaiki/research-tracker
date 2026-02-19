package com.example.backend.dto;

import com.example.backend.entity.research.Status;
import com.example.backend.entity.research.PublicVisibility;
import com.fasterxml.jackson.annotation.JsonProperty;
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
    private int authorPlace;
    private List<AuthorDTO> authors = new ArrayList<>();
    private PublicationDTO publication;
    private String paperUrl;
    private String overleafUrl;
    private String driveUrl;
    private String datasetUrl;
    private PublicVisibility publicVisibility;
    private List<String> tags = new ArrayList<>();
    private boolean featured;

    @JsonProperty("synopsis")
    private String abstractText;

    private String notes;
    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate submissionDate;
    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate decisionDate;
    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate publicationDate;
}
