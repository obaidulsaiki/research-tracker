package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConferenceMetadataDTO {
    private String name;
    private String venue;
    private String indexedBy;
    private String url;
    private Integer year;
}
