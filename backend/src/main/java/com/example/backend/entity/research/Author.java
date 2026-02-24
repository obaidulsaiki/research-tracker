package com.example.backend.entity.research;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "authors", uniqueConstraints = { @UniqueConstraint(columnNames = "name") })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Author {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    private String name;
}
