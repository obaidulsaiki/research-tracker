package com.example.backend.dto;

import lombok.Data;

@Data
public class PublicationDTO {
    private Long id;
    private String type;
    private String name;
    private String publisher;
    private String year;
    private String venue;
    private String indexedBy;
    private String impactFactor;
    private String quartile;
    private String url;
}
