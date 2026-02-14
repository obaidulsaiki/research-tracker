package com.example.backend.service;

import com.example.backend.dto.AuthorDTO;
import com.example.backend.dto.PublicationDTO;
import com.example.backend.dto.ResearchDTO;
import com.example.backend.entity.research.Status;
import com.example.backend.entity.research.PublicVisibility;
import com.opencsv.CSVReader;
import com.opencsv.CSVWriter;
import org.springframework.stereotype.Service;
import java.io.*;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CsvService {

    public byte[] exportToCsv(List<ResearchDTO> researches) throws IOException {
        StringWriter writer = new StringWriter();
        CSVWriter csvWriter = new CSVWriter(writer);

        // Standard header for new structure (23 columns)
        csvWriter.writeNext(new String[] {
                "NO", "Status", "PID", "Title", "Type", "Publication Name", "Publisher", "Year", "Venue",
                "Impact Factor", "Quartile", "Direct Link", "Authors", "Overleaf", "Drive", "Dataset",
                "Visibility", "Featured", "Tags", "Notes", "Submission Date", "Decision Date", "Publication Date"
        });

        int no = 1;
        for (ResearchDTO r : researches) {
            StringBuilder authorsStr = new StringBuilder();
            if (r.getAuthors() != null) {
                for (AuthorDTO a : r.getAuthors()) {
                    if (authorsStr.length() > 0)
                        authorsStr.append("; ");
                    authorsStr.append(a.getName());
                }
            }

            PublicationDTO p = r.getPublication() != null ? r.getPublication() : new PublicationDTO();

            csvWriter.writeNext(new String[] {
                    String.valueOf(no++),
                    r.getStatus() != null ? r.getStatus().name() : "WORKING",
                    String.valueOf(r.getPid()),
                    r.getTitle(),
                    p.getType() != null ? p.getType() : "ARTICLE",
                    p.getName() != null ? p.getName() : "NONE",
                    p.getPublisher() != null ? p.getPublisher() : "NONE",
                    p.getYear() != null ? p.getYear() : "NONE",
                    p.getVenue() != null ? p.getVenue() : "NONE",
                    p.getImpactFactor() != null ? p.getImpactFactor() : "0.0",
                    p.getQuartile() != null ? p.getQuartile() : "N/A",
                    p.getUrl() != null ? p.getUrl() : "NONE",
                    authorsStr.toString(),
                    r.getOverleafUrl() != null ? r.getOverleafUrl() : "NONE",
                    r.getDriveUrl() != null ? r.getDriveUrl() : "NONE",
                    r.getDatasetUrl() != null ? r.getDatasetUrl() : "NONE",
                    r.getPublicVisibility() != null ? r.getPublicVisibility().name() : "PRIVATE",
                    String.valueOf(r.isFeatured()),
                    r.getTags() != null ? String.join(", ", r.getTags()) : "",
                    r.getNotes() != null ? r.getNotes() : "",
                    r.getSubmissionDate() != null ? r.getSubmissionDate().toString() : "",
                    r.getDecisionDate() != null ? r.getDecisionDate().toString() : "",
                    r.getPublicationDate() != null ? r.getPublicationDate().toString() : ""
            });
        }

        csvWriter.close();
        return writer.toString().getBytes();
    }

    public List<ResearchDTO> importFromCsv(InputStream inputStream) throws Exception {
        List<ResearchDTO> researches = new ArrayList<>();
        try (CSVReader reader = new CSVReader(new InputStreamReader(inputStream))) {
            String[] line;
            boolean firstLine = true;
            while ((line = reader.readNext()) != null) {
                if (firstLine) {
                    firstLine = false;
                    continue;
                }

                if (line.length < 5)
                    continue;
                if (line[0].equalsIgnoreCase("NO") || line[3].equalsIgnoreCase("Title"))
                    continue;

                try {
                    ResearchDTO dto = new ResearchDTO();
                    dto.setStatus(parseStatus(line[1]));
                    if (line.length > 2)
                        dto.setPid(parseInt(line[2]));
                    if (line.length > 3)
                        dto.setTitle(line[3]);

                    PublicationDTO p = new PublicationDTO();
                    dto.setPublication(p);

                    // New 23-column format or intermediate formats
                    if (line.length >= 16) {
                        p.setType(line[4]);
                        p.setName(line[5]);
                        p.setPublisher(line[6]);
                        p.setYear(line[7]);
                        p.setVenue(line[8]);
                        p.setImpactFactor(line[9]);
                        p.setQuartile(line[10]);
                        p.setUrl(parseUrl(line[11]));
                        dto.setAuthors(parseAuthors(line[12]));
                        dto.setOverleafUrl(parseUrl(line[13]));
                        dto.setDriveUrl(parseUrl(line[14]));
                        dto.setDatasetUrl(parseUrl(line[15]));

                        // New fields for version with 17+ columns
                        if (line.length > 16)
                            dto.setPublicVisibility(parseVisibility(line[16]));
                        if (line.length > 17)
                            dto.setFeatured(Boolean.parseBoolean(line[17]));
                        if (line.length > 18)
                            dto.setTags(parseTags(line[18]));
                        if (line.length > 19)
                            dto.setNotes(line[19]);
                        if (line.length > 20)
                            dto.setSubmissionDate(parseDate(line[20]));
                        if (line.length > 21)
                            dto.setDecisionDate(parseDate(line[21]));
                        if (line.length > 22)
                            dto.setPublicationDate(parseDate(line[22]));

                        if (dto.getPublicVisibility() == null)
                            dto.setPublicVisibility(PublicVisibility.PRIVATE);
                    } else if (line.length >= 13) {
                        // Legacy 13-15 column formats
                        p.setType(line[4]);
                        dto.setAuthorPlace(parseInt(line[5]));
                        dto.setAuthors(parseAuthors(line[6]));
                        p.setName(line[7]);
                        p.setPublisher(line[7]);
                        p.setYear(line[8]);
                        p.setImpactFactor(line[9]);
                        if (line.length > 10)
                            dto.setOverleafUrl(parseUrl(line[10]));
                        if (line.length > 11)
                            dto.setPaperUrl(parseUrl(line[11]));
                        if (line.length > 12)
                            dto.setDriveUrl(parseUrl(line[12]));
                        if (line.length > 13)
                            dto.setDatasetUrl(parseUrl(line[13]));
                        dto.setPublicVisibility(PublicVisibility.PRIVATE);
                    } else {
                        // Standard fallback
                        p.setType(line[4]);
                        p.setName(line.length > 5 ? line[5] : "NONE");
                        dto.setPublicVisibility(PublicVisibility.PRIVATE);
                    }
                    researches.add(dto);
                } catch (Exception e) {
                    System.err.println("Error parsing CSV line: " + e.getMessage());
                }
            }
        }
        return researches;
    }

    private PublicVisibility parseVisibility(String val) {
        if (val == null || val.trim().isEmpty())
            return PublicVisibility.PRIVATE;
        try {
            return PublicVisibility.valueOf(val.trim().toUpperCase());
        } catch (Exception e) {
            return PublicVisibility.PRIVATE;
        }
    }

    private List<String> parseTags(String val) {
        if (val == null || val.trim().isEmpty())
            return new ArrayList<>();
        return Arrays.stream(val.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    private LocalDate parseDate(String val) {
        if (val == null || val.trim().isEmpty() || val.equals("NONE"))
            return null;
        try {
            return LocalDate.parse(val.trim());
        } catch (DateTimeParseException e) {
            return null;
        }
    }

    private List<AuthorDTO> parseAuthors(String authorsStr) {
        if (authorsStr == null || authorsStr.trim().isEmpty())
            return new ArrayList<>();
        // Split by comma, semicolon, or " and " (case-insensitive)
        String[] names = authorsStr.split("(?i)[;,]|\\s+and\\s+");
        List<AuthorDTO> authors = new ArrayList<>();
        for (int i = 0; i < names.length; i++) {
            String name = names[i];
            if (name.trim().isEmpty())
                continue;
            AuthorDTO author = new AuthorDTO();
            String cleanName = name.replaceAll("[*†‡§]", "").trim();
            if (cleanName.isEmpty())
                continue;
            author.setName(cleanName);
            author.setRole("Author");
            author.setContributionPercentage(authors.size() + 1);
            authors.add(author);
        }
        return authors;
    }

    private Status parseStatus(String val) {
        if (val == null || val.trim().isEmpty())
            return Status.WORKING;
        String s = val.trim().toUpperCase().replace(" ", "_");
        if (s.equals("UNDER_REVIEW"))
            return Status.RUNNING;
        try {
            return Status.valueOf(s);
        } catch (Exception e) {
            return Status.WORKING;
        }
    }

    private String parseUrl(String val) {
        if (val == null || val.trim().isEmpty() || val.equals("---"))
            return null;
        String url = val.trim();
        if (!url.startsWith("http"))
            return null;
        return url;
    }

    private int parseInt(String val) {
        if (val == null)
            return 0;
        String clean = val.replaceAll("\\D", "");
        if (clean.isEmpty())
            return 0;
        try {
            return Integer.parseInt(clean);
        } catch (Exception e) {
            return 0;
        }
    }
}
