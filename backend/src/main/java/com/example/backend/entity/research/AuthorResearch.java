package com.example.backend.entity.research;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "author_research")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(AuthorResearchId.class)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class AuthorResearch {

    @Id
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "author_id")
    @EqualsAndHashCode.Include
    private Author author;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "research_id")
    @JsonBackReference
    @EqualsAndHashCode.Include
    private Research research;

    private String role;
    private Integer authorOrder;
}
