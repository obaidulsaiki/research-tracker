package com.example.backend.service;

import com.example.backend.entity.research.Author;
import com.example.backend.entity.research.AuthorResearch;
import com.example.backend.entity.research.Research;
import com.example.backend.repository.AuthorRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthorService {

    private final AuthorRepo authorRepo;

    @Transactional
    public void resolveAuthorsForResearch(Research research) {
        if (research.getAuthors() == null)
            return;

        // Step 1: Set the back-reference on all items first to prevent
        // Hibernate from throwing "Could not assign id from null association"
        // if it decides to flush during the subsequent queries.
        for (AuthorResearch ar : research.getAuthors()) {
            ar.setResearch(research);
        }

        // Step 2: Resolve the Authors against the database
        for (AuthorResearch ar : research.getAuthors()) {
            if (ar.getAuthor() != null && ar.getAuthor().getName() != null) {
                Author resolvedAuthor = authorRepo.findByName(ar.getAuthor().getName())
                        .orElseGet(() -> {
                            Author newAuthor = new Author();
                            newAuthor.setName(ar.getAuthor().getName());
                            return authorRepo.save(newAuthor);
                        });
                ar.setAuthor(resolvedAuthor);
            }
        }
    }
}
