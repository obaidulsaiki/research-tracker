package com.example.backend.repository;

import com.example.backend.entity.research.Author;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthorRepo extends JpaRepository<Author, Long> {
    java.util.Optional<Author> findByName(String name);
}
