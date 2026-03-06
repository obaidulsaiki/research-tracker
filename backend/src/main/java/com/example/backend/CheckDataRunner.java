package com.example.backend;

import com.example.backend.repository.ConferenceRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class CheckDataRunner implements CommandLineRunner {
    private final ConferenceRepo repo;

    public CheckDataRunner(ConferenceRepo repo) {
        this.repo = repo;
    }

    @Override
    public void run(String... args) {
        System.out.println("CHECKING CONFERENCES TABLE...");
        long count = repo.count();
        System.out.println("TOTAL CONFERENCES IN DB: " + count);
    }
}
