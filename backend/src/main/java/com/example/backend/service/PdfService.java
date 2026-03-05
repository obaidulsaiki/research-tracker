package com.example.backend.service;

import com.example.backend.dto.AuthorDTO;
import com.example.backend.dto.PublicationDTO;
import com.example.backend.dto.ResearchDTO;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PdfService {

    public byte[] exportToPdf(List<ResearchDTO> researches, String style) {
        // Filter: only accepted, published and running papers
        List<ResearchDTO> filtered = researches.stream()
                .filter(r -> r.getStatus() != null &&
                        (r.getStatus().name().equalsIgnoreCase("ACCEPTED") ||
                                r.getStatus().name().equalsIgnoreCase("PUBLISHED") ||
                                r.getStatus().name().equalsIgnoreCase("RUNNING")))
                .collect(Collectors.toList());

        if ("STYLISH".equalsIgnoreCase(style)) {
            return exportToPdfStylish(filtered);
        } else {
            return exportToPdfProfessional(filtered);
        }
    }

    private byte[] exportToPdfProfessional(List<ResearchDTO> researches) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, out);
            document.setMargins(40, 40, 40, 40);
            document.open();

            // Fonts
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, java.awt.Color.DARK_GRAY);
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 10);
            Font bodyBoldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10);
            Font metaFont = FontFactory.getFont(FontFactory.HELVETICA, 10, java.awt.Color.GRAY);
            Font linkFont = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 10, new java.awt.Color(37, 99, 235));

            // Section Header
            Paragraph header = new Paragraph("RESEARCH PUBLICATIONS", titleFont);
            header.setSpacingAfter(4);
            document.add(header);

            // Horizontal Line
            PdfPTable lineTable = new PdfPTable(1);
            lineTable.setWidthPercentage(100);
            PdfPCell lineCell = new PdfPCell(new Phrase(" "));
            lineCell.setBorder(Rectangle.BOTTOM);
            lineCell.setBorderWidth(1f);
            lineCell.setPadding(0);
            lineTable.addCell(lineCell);
            lineTable.setSpacingAfter(15);
            document.add(lineTable);

            // List starts
            if (researches.isEmpty()) {
                Paragraph emptyMsg = new Paragraph(
                        "\nNo research records found with statuses: Accepted, Published, or Running.", bodyFont);
                emptyMsg.setAlignment(Element.ALIGN_CENTER);
                document.add(emptyMsg);
            }

            for (ResearchDTO r : researches) {
                // Main Container Table for this entry
                PdfPTable itemTable = new PdfPTable(2);
                itemTable.setWidthPercentage(100);
                itemTable.setWidths(new float[] { 82f, 18f });

                PublicationDTO p = r.getPublication() != null ? r.getPublication() : new PublicationDTO();

                String rawType = p.getType() != null ? p.getType() : "";
                String typePrefix = (rawType.length() > 0)
                        ? rawType.substring(0, 1).toUpperCase() + rawType.substring(1).toLowerCase()
                        : "Article";

                // Column 1: Bullet + Type + Title
                Phrase firstLineLeft = new Phrase();
                firstLineLeft.add(new Chunk("> ", bodyBoldFont));
                firstLineLeft.add(new Chunk(typePrefix + ": ", bodyBoldFont));
                firstLineLeft.add(new Chunk(r.getTitle() != null ? r.getTitle() : "Untitled", bodyFont));

                if (r.getStatus() != null && "ACCEPTED".equalsIgnoreCase(r.getStatus().name())) {
                    firstLineLeft.add(new Chunk(" [Accepted]", bodyBoldFont));
                }

                PdfPCell cellLeft = new PdfPCell(firstLineLeft);
                cellLeft.setBorder(Rectangle.NO_BORDER);
                cellLeft.setPaddingBottom(2f);
                itemTable.addCell(cellLeft);

                // Column 2: Link
                Phrase firstLineRight = new Phrase();
                if (r.getPaperUrl() != null && !r.getPaperUrl().isBlank()
                        && !r.getPaperUrl().equalsIgnoreCase("NONE")) {
                    Anchor anchor = new Anchor("Link", linkFont);
                    anchor.setReference(r.getPaperUrl());
                    firstLineRight.add(anchor);
                } else if (p.getUrl() != null && !p.getUrl().isBlank() && !p.getUrl().equalsIgnoreCase("NONE")) {
                    Anchor anchor = new Anchor("Link", linkFont);
                    anchor.setReference(p.getUrl());
                    firstLineRight.add(anchor);
                }
                PdfPCell cellRight = new PdfPCell(firstLineRight);
                cellRight.setHorizontalAlignment(Element.ALIGN_RIGHT);
                cellRight.setBorder(Rectangle.NO_BORDER);
                cellRight.setPaddingBottom(2f);
                itemTable.addCell(cellRight);

                // Second Line Table
                PdfPTable secondLineTable = new PdfPTable(2);
                secondLineTable.setWidthPercentage(100);
                secondLineTable.setWidths(new float[] { 75f, 25f });

                // Left: Journal Name (Quartile) or Publisher/Conference
                Phrase secondLineLeft = new Phrase();
                secondLineLeft.add(new Chunk("  ")); // indentation
                String pubInfo = p.getName();
                if (pubInfo != null && !pubInfo.equalsIgnoreCase("NONE") && !pubInfo.isBlank()) {
                    secondLineLeft.add(new Chunk(pubInfo, bodyBoldFont));
                } else {
                    secondLineLeft.add(new Chunk("General Publication", bodyBoldFont));
                }

                if (p.getQuartile() != null && !p.getQuartile().equalsIgnoreCase("N/A")
                        && !p.getQuartile().contains("NONE") && !p.getQuartile().isBlank()) {
                    secondLineLeft.add(new Chunk(" (" + p.getQuartile() + ")", metaFont));
                } else if (p.getVenue() != null && !p.getVenue().isBlank() && !p.getVenue().equalsIgnoreCase("NONE")) {
                    secondLineLeft.add(new Chunk(" - " + p.getVenue(), metaFont));
                } else if (p.getPublisher() != null && !p.getPublisher().isBlank()
                        && !p.getPublisher().equalsIgnoreCase("NONE")) {
                    secondLineLeft.add(new Chunk(" - " + p.getPublisher(), metaFont));
                }

                PdfPCell cellSecLeft = new PdfPCell(secondLineLeft);
                cellSecLeft.setBorder(Rectangle.NO_BORDER);
                secondLineTable.addCell(cellSecLeft);

                // Right: Year
                Phrase secondLineRight = new Phrase();
                String yr = p.getYear() != null ? p.getYear() : "";
                if (yr.equals("NONE") || yr.equals("0"))
                    yr = "";
                secondLineRight.add(new Chunk(yr, bodyFont));

                PdfPCell cellSecRight = new PdfPCell(secondLineRight);
                cellSecRight.setHorizontalAlignment(Element.ALIGN_RIGHT);
                cellSecRight.setBorder(Rectangle.NO_BORDER);
                secondLineTable.addCell(cellSecRight);

                document.add(itemTable);
                document.add(secondLineTable);

                // Small space between entries
                Paragraph gap = new Paragraph(" ");
                gap.setLeading(10);
                document.add(gap);
            }

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            e.printStackTrace();
            return new byte[0];
        }
    }

    private byte[] exportToPdfStylish(List<ResearchDTO> researches) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4.rotate());
            PdfWriter.getInstance(document, out);
            document.open();

            // Fonts
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Font tableHeaderFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9);
            Font tableBodyFont = FontFactory.getFont(FontFactory.HELVETICA, 8);

            // Title
            Paragraph title = new Paragraph("Research Portfolio Summary", headerFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            // Table with 10 most critical columns for PDF fit
            PdfPTable table = new PdfPTable(10);
            table.setWidthPercentage(100);
            table.setWidths(new float[] { 1.5f, 2.5f, 5.0f, 2.5f, 3.5f, 1.5f, 1.5f, 1.5f, 4.0f, 2.0f });

            // Column Headers
            String[] headers = { "PID", "Status", "Title", "Type", "Publication", "Year", "IF", "Q", "Authors",
                    "Featured" };
            for (String h : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(h, tableHeaderFont));
                cell.setBackgroundColor(java.awt.Color.LIGHT_GRAY);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                table.addCell(cell);
            }

            // Data Rows
            for (ResearchDTO r : researches) {
                PublicationDTO p = r.getPublication() != null ? r.getPublication() : new PublicationDTO();
                String authors = r.getAuthors() == null ? ""
                        : r.getAuthors().stream().map(AuthorDTO::getName).collect(Collectors.joining("; "));

                table.addCell(new Phrase(String.valueOf(r.getPid()), tableBodyFont));
                table.addCell(new Phrase(r.getStatus() != null ? r.getStatus().name() : "WORKING", tableBodyFont));
                table.addCell(new Phrase(r.getTitle(), tableBodyFont));
                table.addCell(new Phrase(p.getType() != null ? p.getType() : "ARTICLE", tableBodyFont));
                table.addCell(new Phrase(p.getName() != null ? p.getName() : "NONE", tableBodyFont));
                table.addCell(new Phrase(p.getYear() != null ? p.getYear() : "NONE", tableBodyFont));
                table.addCell(new Phrase(p.getImpactFactor() != null ? p.getImpactFactor() : "0.0", tableBodyFont));
                table.addCell(new Phrase(p.getQuartile() != null ? p.getQuartile() : "N/A", tableBodyFont));
                table.addCell(new Phrase(authors, tableBodyFont));
                table.addCell(new Phrase(r.isFeatured() ? "YES" : "NO", tableBodyFont));
            }

            document.add(table);
            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            e.printStackTrace();
            return new byte[0];
        }
    }
}
