package com.example.backend.service;

import com.example.backend.dto.AuthorDTO;
import com.example.backend.dto.ResearchDTO;
import com.example.backend.entity.research.Status;
import com.example.backend.entity.research.PaperType;
import com.example.backend.entity.research.JournalQuartile;
import com.example.backend.entity.research.PublicVisibility;
import com.opencsv.CSVReader;
import com.opencsv.CSVWriter;
import org.springframework.stereotype.Service;
import java.io.*;
import java.util.ArrayList;
import java.util.List;

@Service
public class CsvService {

    public byte[] exportToCsv(List<ResearchDTO> researches) throws IOException {
        StringWriter writer = new StringWriter();
        CSVWriter csvWriter = new CSVWriter(writer);

        // Standard 14-column header (Excel spec)
        csvWriter.writeNext(new String[] {
                "NO", "Status", "PID", "Title", "Type", "Place", "Authors",
                "Publisher Name", "Year", "Journal Q", "Overleaf", "Online", "Drive", "Dataset"
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

            csvWriter.writeNext(new String[] {
                    String.valueOf(no++),
                    r.getStatus() != null ? r.getStatus().name() : "WORKING",
                    String.valueOf(r.getPid()),
                    r.getTitle(),
                    r.getPaperType() != null ? r.getPaperType().name() : "ARTICLE",
                    String.valueOf(r.getAuthorPlace()),
                    authorsStr.toString(),
                    r.getPublisherName(),
                    r.getPublisherYear(),
                    r.getJournalQuartile() != null ? r.getJournalQuartile().name() : "NONE",
                    r.getOverleafUrl(),
                    r.getPaperUrl(),
                    r.getDriveUrl(),
                    r.getDatasetUrl()
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

                ResearchDTO dto = new ResearchDTO();
                try {
                    if (line.length <= 1 || line[3] == null || line[3].trim().isEmpty()) {
                        continue; // Skip lines with no title or too short
                    }
                    if (line.length > 1)
                        dto.setStatus(parseStatus(line[1]));
                    if (line.length > 2)
                        dto.setPid(parseInt(line[2]));
                    if (line.length > 3)
                        dto.setTitle(line[3]);
                    if (line.length > 4)
                        dto.setPaperType(parsePaperType(line[4]));
                    if (line.length > 5)
                        dto.setAuthorPlace(parseInt(line[5]));

                    if (line.length > 6) {
                        String authorsStr = line[6];
                        // Split by comma, semicolon, or " and " (case-insensitive)
                        String[] names = authorsStr.split("(?i)[;,]|\\s+and\\s+");
                        List<AuthorDTO> authors = new ArrayList<>();
                        for (String name : names) {
                            if (name.trim().isEmpty())
                                continue;
                            AuthorDTO author = new AuthorDTO();
                            String cleanName = name.replaceAll("[*†‡§]", "").trim();
                            if (cleanName.isEmpty())
                                continue;
                            author.setName(cleanName);
                            author.setRole("Author");
                            authors.add(author);
                        }
                        dto.setAuthors(authors);
                    }

                    if (line.length > 7)
                        dto.setPublisherName(line[7]);
                    if (line.length > 8)
                        dto.setPublisherYear(line[8]);
                    if (line.length > 9)
                        dto.setJournalQuartile(parseQuartile(line[9]));
                    if (line.length > 10)
                        dto.setOverleafUrl(parseUrl(line[10]));
                    if (line.length > 11)
                        dto.setPaperUrl(parseUrl(line[11]));
                    if (line.length > 12)
                        dto.setDriveUrl(parseUrl(line[12]));
                    if (line.length > 13)
                        dto.setDatasetUrl(parseUrl(line[13]));

                    dto.setPublicVisibility(PublicVisibility.PRIVATE);
                    researches.add(dto);
                } catch (Exception e) {
                    System.err.println("Error parsing CSV line, skipping: " + e.getMessage());
                }
            }
        }
        return researches;
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

    private PaperType parsePaperType(String val) {
        if (val == null || val.trim().isEmpty())
            return PaperType.ARTICLE;
        try {
            return PaperType.valueOf(val.trim().toUpperCase());
        } catch (Exception e) {
            return PaperType.ARTICLE;
        }
    }

    private JournalQuartile parseQuartile(String val) {
        if (val == null || val.trim().isEmpty())
            return JournalQuartile.NONE;
        try {
            return JournalQuartile.valueOf(val.trim().toUpperCase());
        } catch (Exception e) {
            return JournalQuartile.NONE;
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
