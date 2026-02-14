package com.example.backend.entity.research;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class Research {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private Status status;

    private int pid;
    private String title;

    private int authorPlace;

    @OneToMany(mappedBy = "research", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JsonManagedReference
    private List<Author> authors = new ArrayList<>();

    @OneToMany(mappedBy = "research", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<HistoryEntry> historyEntries = new ArrayList<>();

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "publication_id", referencedColumnName = "id")
    private Publication publication;

    @URL
    private String paperUrl;
    @URL
    private String overleafUrl;
    @URL
    private String driveUrl;
    @URL
    private String datasetUrl;

    @Enumerated(EnumType.STRING)
    private PublicVisibility publicVisibility;

    @ElementCollection
    private List<String> tags = new ArrayList<>();

    private boolean featured;

    private String notes;

    private LocalDate submissionDate;
    private LocalDate decisionDate;
    private LocalDate publicationDate;

}
