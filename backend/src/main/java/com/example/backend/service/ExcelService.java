package com.example.backend.service;

import com.example.backend.dto.AuthorDTO;
import com.example.backend.dto.PublicationDTO;
import com.example.backend.dto.ResearchDTO;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExcelService {

    public byte[] exportToExcel(List<ResearchDTO> researches) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Research Portfolio");

            // Header style
            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setFillForegroundColor(IndexedColors.CORNFLOWER_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            Font headerFont = workbook.createFont();
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);

            // Columns
            String[] columns = {
                    "NO", "Status", "PID", "Title", "Type", "Publication Name", "Publisher", "Year", "Venue",
                    "Impact Factor", "Quartile", "Direct Link", "Authors", "Overleaf", "Drive", "Dataset",
                    "Visibility", "Featured", "Tags", "Notes", "Submission Date", "Decision Date", "Publication Date"
            };

            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowNum = 1;
            for (ResearchDTO r : researches) {
                Row row = sheet.createRow(rowNum++);

                PublicationDTO p = r.getPublication() != null ? r.getPublication() : new PublicationDTO();
                String authors = r.getAuthors() == null ? ""
                        : r.getAuthors().stream().map(AuthorDTO::getName).collect(Collectors.joining("; "));

                row.createCell(0).setCellValue(rowNum - 1);
                row.createCell(1).setCellValue(r.getStatus() != null ? r.getStatus().name() : "WORKING");
                row.createCell(2).setCellValue(r.getPid());
                row.createCell(3).setCellValue(r.getTitle());
                row.createCell(4).setCellValue(p.getType() != null ? p.getType() : "ARTICLE");
                row.createCell(5).setCellValue(p.getName() != null ? p.getName() : "NONE");
                row.createCell(6).setCellValue(p.getPublisher() != null ? p.getPublisher() : "NONE");
                row.createCell(7).setCellValue(p.getYear() != null ? p.getYear() : "NONE");
                row.createCell(8).setCellValue(p.getVenue() != null ? p.getVenue() : "NONE");
                row.createCell(9).setCellValue(p.getImpactFactor() != null ? p.getImpactFactor() : "0.0");
                row.createCell(10).setCellValue(p.getQuartile() != null ? p.getQuartile() : "N/A");
                row.createCell(11).setCellValue(p.getUrl() != null ? p.getUrl() : "NONE");
                row.createCell(12).setCellValue(authors);
                row.createCell(13).setCellValue(r.getOverleafUrl() != null ? r.getOverleafUrl() : "NONE");
                row.createCell(14).setCellValue(r.getDriveUrl() != null ? r.getDriveUrl() : "NONE");
                row.createCell(15).setCellValue(r.getDatasetUrl() != null ? r.getDatasetUrl() : "NONE");
                row.createCell(16)
                        .setCellValue(r.getPublicVisibility() != null ? r.getPublicVisibility().name() : "PRIVATE");
                row.createCell(17).setCellValue(r.isFeatured() ? "YES" : "NO");
                row.createCell(18).setCellValue(r.getTags() != null ? String.join(", ", r.getTags()) : "");
                row.createCell(19).setCellValue(r.getNotes() != null ? r.getNotes() : "");
                row.createCell(20).setCellValue(r.getSubmissionDate() != null ? r.getSubmissionDate().toString() : "");
                row.createCell(21).setCellValue(r.getDecisionDate() != null ? r.getDecisionDate().toString() : "");
                row.createCell(22)
                        .setCellValue(r.getPublicationDate() != null ? r.getPublicationDate().toString() : "");
            }

            // Auto-size columns
            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }
}
