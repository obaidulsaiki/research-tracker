package com.example.backend.entity.research;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Author {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String role;
    private double contributionPercentage;

    @ManyToOne
    @JoinColumn(name = "research_id")
    @JsonBackReference
    private Research research;
}
