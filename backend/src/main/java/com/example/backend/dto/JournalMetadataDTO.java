package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JournalMetadataDTO {
    private String name;
    private String publisher;
    private String impactFactor;
    private String quartile;
    private String url;
}
