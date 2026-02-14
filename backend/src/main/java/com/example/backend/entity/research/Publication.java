package com.example.backend.entity.research;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Publication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // Replaces PaperType Enum
    private String name; // e.g., Title of Journal/Conference
    private String publisher;
    private String year;
    private String venue;
    private String impactFactor;
    private String quartile;
    private String url;

    @OneToOne(mappedBy = "publication")
    @JsonBackReference
    private Research research;
}
