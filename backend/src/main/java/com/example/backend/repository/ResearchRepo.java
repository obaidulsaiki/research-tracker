package com.example.backend.repository;

import com.example.backend.entity.research.Research;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResearchRepo extends JpaRepository<Research, Long> {
}
