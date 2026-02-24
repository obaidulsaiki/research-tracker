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
            java.util.Map<String, Integer> headerMap = new java.util.HashMap<>();
            boolean headerParsed = false;

            while ((line = reader.readNext()) != null) {
                // SKIP EMPTY LINES
                if (line.length == 0)
                    continue;

                // HEADER DETECTION (First line or explicit header content)
                if (!headerParsed) {
                    // Build header map
                    for (int i = 0; i < line.length; i++) {
                        headerMap.put(line[i].trim().toLowerCase(), i);
                    }
                    headerParsed = true;
                    continue; // Skip the header row itself
                }

                // If we encounter a repeated header line, skip it
                if (line.length > 3
                        && (line[0].equalsIgnoreCase("NO") || (line.length > 3 && line[3].equalsIgnoreCase("Title")))) {
                    continue;
                }

                if (line.length < 3)
                    continue; // Skip malformed short lines

                try {
                    ResearchDTO dto = new ResearchDTO();

                    // BASIC FIELDS (Use Map if available, else Fallback to new standard indices)
                    dto.setStatus(parseStatus(getVal(line, headerMap, "status", 1)));
                    dto.setPid(parseInt(getVal(line, headerMap, "pid", 2)));
                    dto.setTitle(getVal(line, headerMap, "title", 3));

                    PublicationDTO p = new PublicationDTO();
                    dto.setPublication(p);

                    // EXTRACT FIELDS DYNAMICALLY
                    // Note: We use the "New Standard" indices as default if header lookup fails
                    // This preserves backward compatibility for files matching the current export
                    // format exactly

                    p.setType(getVal(line, headerMap, "type", 4));
                    p.setName(toTitleCase(getVal(line, headerMap, "publication name", 5)));
                    p.setPublisher(toTitleCase(getVal(line, headerMap, "publisher", 6)));
                    p.setYear(getVal(line, headerMap, "year", 7));
                    p.setVenue(toTitleCase(getVal(line, headerMap, "venue", 8)));
                    p.setImpactFactor(getVal(line, headerMap, "impact factor", 9));
                    p.setQuartile(getVal(line, headerMap, "quartile", 10));
                    p.setUrl(parseUrl(getVal(line, headerMap, "direct link", 11)));

                    // CRITICAL: Authors vs Publication Name
                    // If map has "authors", it will use that index. If not, it falls back to 12.
                    dto.setAuthors(parseAuthors(getVal(line, headerMap, "authors", 12)));

                    dto.setOverleafUrl(parseUrl(getVal(line, headerMap, "overleaf", 13)));
                    dto.setDriveUrl(parseUrl(getVal(line, headerMap, "drive", 14)));
                    dto.setDatasetUrl(parseUrl(getVal(line, headerMap, "dataset", 15)));

                    dto.setPublicVisibility(parseVisibility(getVal(line, headerMap, "visibility", 16)));

                    String featuredStr = getVal(line, headerMap, "featured", 17);
                    dto.setFeatured(featuredStr != null && Boolean.parseBoolean(featuredStr));

                    dto.setTags(parseTags(getVal(line, headerMap, "tags", 18)));
                    dto.setNotes(getVal(line, headerMap, "notes", 19));

                    dto.setSubmissionDate(parseDate(getVal(line, headerMap, "submission date", 20)));
                    dto.setDecisionDate(parseDate(getVal(line, headerMap, "decision date", 21)));
                    dto.setPublicationDate(parseDate(getVal(line, headerMap, "publication date", 22)));

                    // FALLBACK FOR LEGACY IF DATA SEEMS MISSING
                    // Check if we accidentally got "Authors" (column 12 default) empty but have
                    // data in column 6 (Legacy Authors)
                    // Only do this if headers were NOT found for "authors" to avoid overriding
                    // correct mapping
                    if (dto.getAuthors().isEmpty() && !headerMap.containsKey("authors") && line.length > 6) {
                        // Try extracting from legacy index 6 if it looks like author data
                        List<AuthorDTO> legacyAuthors = parseAuthors(line[6]);
                        if (!legacyAuthors.isEmpty()) {
                            dto.setAuthors(legacyAuthors);
                            // If we found authors at 6, likely 5 is author place and 7 is publication name
                            if (line.length > 7)
                                p.setName(line[7]);
                        }
                    }

                    if (dto.getPublicVisibility() == null)
                        dto.setPublicVisibility(PublicVisibility.PRIVATE);

                    researches.add(dto);
                } catch (Exception e) {
                    System.err.println("Error parsing CSV line: " + e.getMessage());
                }
            }
        }
        return researches;
    }

    private String getVal(String[] line, java.util.Map<String, Integer> map, String key, int defaultIdx) {
        if (map.containsKey(key) && map.get(key) < line.length) {
            return line[map.get(key)];
        }
        if (defaultIdx < line.length) {
            return line[defaultIdx];
        }
        return null;
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
            author.setAuthorOrder(authors.size() + 1);
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

    private String toTitleCase(String input) {
        if (input == null || input.isEmpty()) {
            return input;
        }

        // Special handling for known acronyms (Conferences, Organizations)
        java.util.Set<String> acronyms = new java.util.HashSet<>(java.util.Arrays.asList(
                "ICCIT", "ICECTE", "ICEFRONT", "PECCII", "QPAIN", "IEEE", "ACM", "SN", "MDPI", "ACM", "IUBAT"));

        // If the whole string is an acronym, return it as is
        if (acronyms.contains(input.trim().toUpperCase())) {
            return input.trim().toUpperCase();
        }

        // Standard Title Case logic (Capitalize first letter of each word)
        StringBuilder titleCase = new StringBuilder();
        boolean nextTitleCase = true;

        // Split by words to check for acronyms within a longer string
        String[] words = input.toLowerCase().split("\\s+");
        for (int i = 0; i < words.length; i++) {
            String w = words[i];
            if (acronyms.contains(w.toUpperCase())) {
                titleCase.append(w.toUpperCase());
            } else {
                for (char c : w.toCharArray()) {
                    if (nextTitleCase) {
                        c = Character.toTitleCase(c);
                        nextTitleCase = false;
                    }
                    titleCase.append(c);
                }
            }
            if (i < words.length - 1) {
                titleCase.append(" ");
                nextTitleCase = true;
            }
        }

        return titleCase.toString();
    }
}
