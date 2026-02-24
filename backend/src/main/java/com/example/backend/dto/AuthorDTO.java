package com.example.backend.dto;

import lombok.Data;

@Data
public class AuthorDTO {
    private Long id;
    private String name;
    private String role;
    private Integer authorOrder;
}
