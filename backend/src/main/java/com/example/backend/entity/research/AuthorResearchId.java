package com.example.backend.entity.research;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthorResearchId implements Serializable {
    private Long author;
    private Long research;
}
