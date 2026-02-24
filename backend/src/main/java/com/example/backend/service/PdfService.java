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

    public byte[] exportToPdf(List<ResearchDTO> researches) {
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
