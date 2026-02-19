import { Injectable } from '@angular/core';
import { Research } from './research.service';

@Injectable({
    providedIn: 'root'
})
export class ExportService {

    constructor() { }

    exportToExcel(items: Research[], getAuthorList: (r: Research) => string) {
        // No-dependency approach: Generate a specialized CSV that Excel recognizes as a spreadsheet
        let csvContent = '\uFEFF'; // Add BOM for Excel UTF-8 support

        // Header for 23-column format
        csvContent += 'No,Status,PID,Title,Type,Publication Name,Publisher,Year,Venue,Impact Factor,Quartile,Direct Link,Authors,Overleaf,Drive,Dataset,Visibility,Featured,Tags,Notes,Submission Date,Decision Date,Publication Date\n';

        items.forEach((r, index) => {
            const pub = (r.publication || {}) as any;
            const row = [
                index + 1,
                `"${r.status || 'WORKING'}"`,
                `"${r.pid || '0'}"`,
                `"${(r.title || 'NONE').replace(/"/g, '""')}"`,
                `"${pub.type || 'ARTICLE'}"`,
                `"${(pub.name || 'NONE').replace(/"/g, '""')}"`,
                `"${(pub.publisher || 'NONE').replace(/"/g, '""')}"`,
                `"${pub.year || 'NONE'}"`,
                `"${(pub.venue || 'NONE').replace(/"/g, '""')}"`,
                `"${pub.impactFactor || '0.0'}"`,
                `"${pub.quartile || 'N/A'}"`,
                `"${pub.url || 'NONE'}"`,
                `"${(getAuthorList(r) || '').replace(/"/g, '""')}"`,
                `"${(r.overleafUrl || 'NONE').replace(/"/g, '""')}"`,
                `"${(r.driveUrl || 'NONE').replace(/"/g, '""')}"`,
                `"${(r.datasetUrl || 'NONE').replace(/"/g, '""')}"`,
                `"${r.publicVisibility || 'PRIVATE'}"`,
                `"${r.featured || 'false'}"`,
                `"${(r.tags ? r.tags.join(', ') : '').replace(/"/g, '""')}"`,
                `"${(r.notes || '').replace(/"/g, '""')}"`,
                `"${r.submissionDate || ''}"`,
                `"${r.decisionDate || ''}"`,
                `"${r.publicationDate || ''}"`
            ];
            csvContent += row.join(',') + '\n';
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'research_archive.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    exportToPdf(html: string) {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        const doc = iframe.contentWindow?.document;
        if (doc) {
            doc.open();
            doc.write(html);
            doc.close();

            iframe.contentWindow?.addEventListener('load', () => {
                setTimeout(() => {
                    iframe.contentWindow?.print();
                    document.body.removeChild(iframe);
                }, 800);
            });
        }
    }

    generateReportHtml(items: Research[], stats: any, getAuthorList: (r: Research) => string): string {
        const clean = (val: any) => val === undefined || val === null ? '-' : val;
        const getStatusCSS = (status: string = '') => {
            const s = status.toUpperCase();
            if (s.includes('ACCEPTED') || s.includes('PUBLISHED')) return 'background: #dcfce7; color: #166534; border-color: #bbf7d0;';
            if (s.includes('SUBMITTED') || s.includes('UNDER REVIEW')) return 'background: #fef9c3; color: #854d0e; border-color: #fef08a;';
            if (s.includes('REJECTED')) return 'background: #fee2e2; color: #991b1b; border-color: #fecaca;';
            return 'background: #f1f5f9; color: #475569; border-color: #e2e8f0;';
        };

        let itemsHtml = '';
        items.forEach((r, idx) => {
            const pub = r.publication || {};
            const authors = getAuthorList(r);

            itemsHtml += `
        <div class="research-card">
          <div class="status-sidebar" style="background: ${r.status === 'PUBLISHED' ? '#22c55e' : (r.status === 'UNDER REVIEW' ? '#eab308' : '#64748b')}"></div>
          <div class="card-main">
            <div class="card-header">
              <h2 class="paper-title">${idx + 1}. ${r.title}</h2>
              <span class="status-badge" style="${getStatusCSS(r.status)}">${r.status}</span>
            </div>
            
            <div class="authors-section">
              <strong>Authors:</strong> ${authors}
            </div>

            <div class="metadata-grid">
              <div class="meta-item"><span class="meta-label">Type</span><span class="meta-value">${clean((pub as any).type)}</span></div>
              <div class="meta-item"><span class="meta-label">Year</span><span class="meta-value">${clean((pub as any).year)}</span></div>
              <div class="meta-item"><span class="meta-label">Publisher</span><span class="meta-value">${clean((pub as any).publisher)}</span></div>
            </div>

            <div class="badge-box">
              <span class="metadata-badge badge-venue">${clean((pub as any).name)}</span>
              <span class="metadata-badge badge-if">IF: ${clean((pub as any).impactFactor)}</span>
              <span class="metadata-badge badge-rank">Rank: ${clean((pub as any).quartile)}</span>
            </div>

            ${(r.notes) ? `<div class="authors-section" style="font-style: italic; opacity: 0.8;">${r.notes}</div>` : ''}
          </div>
        </div>
      `;
        });

        return `
      <!DOCTYPE html>
      <html>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
        <style>
          :root {
            --primary: #2563eb;
            --bg: #f8fafc;
            --card-bg: #ffffff;
            --text-main: #0f172a;
            --text-muted: #64748b;
          }
          
          @page { size: A4 portrait; margin: 15mm; }
          
          body { 
            font-family: 'Plus Jakarta Sans', sans-serif; 
            background: var(--bg); 
            color: var(--text-main); 
            margin: 0; 
            padding: 0;
            -webkit-print-color-adjust: exact;
          }

          .container { max-width: 680px; margin: 0 auto; }

          .exhibition-header {
            background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
            color: white;
            padding: 40px;
            border-radius: 24px;
            margin-bottom: 40px;
            position: relative;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          }

          .header-accent {
            position: absolute;
            top: -50px;
            right: -50px;
            width: 200px;
            height: 200px;
            background: rgba(255,255,255,0.05);
            border-radius: 50%;
          }

          .header-content h1 {
            font-size: 32px;
            font-weight: 800;
            margin: 0 0 8px 0;
            letter-spacing: -1px;
          }

          .header-subtitle {
            font-size: 14px;
            opacity: 0.8;
            text-transform: uppercase;
            letter-spacing: 2px;
            font-weight: 600;
          }

          .metrics-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-top: 30px;
          }

          .metric-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            padding: 20px;
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.15);
          }

          .metric-value {
            font-size: 24px;
            font-weight: 700;
            display: block;
          }

          .metric-label {
            font-size: 11px;
            opacity: 0.7;
            text-transform: uppercase;
            font-weight: 600;
          }

          .research-card {
            background: var(--card-bg);
            border-radius: 20px;
            margin-bottom: 24px;
            padding: 24px;
            position: relative;
            display: flex;
            gap: 24px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            page-break-inside: avoid;
          }

          .status-sidebar {
            width: 6px;
            border-radius: 10px;
            flex-shrink: 0;
          }

          .card-main { flex-grow: 1; }

          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 16px;
          }

          .paper-title {
            font-size: 18px;
            font-weight: 700;
            color: #1e293b;
            margin: 0;
            line-height: 1.4;
            max-width: 80%;
          }

          .status-badge {
            padding: 6px 14px;
            border-radius: 100px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border: 1px solid transparent;
          }

          .metadata-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            background: #f8fafc;
            padding: 16px;
            border-radius: 12px;
            margin-bottom: 16px;
          }

          .badge-box {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin-bottom: 20px;
          }

          .metadata-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 8px 16px;
            border-radius: 100px;
            font-size: 13px;
            font-weight: 700;
            border: 1px solid transparent;
            box-shadow: 0 2px 4px rgba(0,0,0,0.02);
          }

          .badge-venue { background: #fff1f2; color: #9f1239; border-color: #fecdd3; }
          .badge-if { background: #eff6ff; color: #1e40af; border-color: #dbeafe; }
          .badge-rank { background: #f8fafc; color: #475569; border-color: #e2e8f0; }

          .meta-item { display: flex; flex-direction: column; gap: 4px; }
          .meta-label { font-size: 10px; color: var(--text-muted); font-weight: 600; text-transform: uppercase; }
          .meta-value { font-size: 13px; font-weight: 600; color: #334155; }

          .authors-section {
            font-size: 13px;
            color: #475569;
            line-height: 1.6;
            margin-bottom: 16px;
            padding-left: 4px;
          }

          .authors-section strong { color: #1e293b; }

          .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 11px;
            color: var(--text-muted);
            padding-bottom: 40px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="exhibition-header">
            <div class="header-accent"></div>
            <div class="header-content">
              <span class="header-subtitle">Official Research Portfolio</span>
              <h1>Researcher Scholastic Archive</h1>
              
              <div class="metrics-grid">
                <div class="metric-card">
                  <span class="metric-value">${stats.total}</span>
                  <span class="metric-label">Total Works</span>
                </div>
                <div class="metric-card">
                  <span class="metric-value">${stats.published}</span>
                  <span class="metric-label">Published</span>
                </div>
                <div class="metric-card">
                  <span class="metric-value">${stats.q1}</span>
                  <span class="metric-label">Q1/Q2 Impact</span>
                </div>
              </div>
            </div>
          </div>

          <div class="archives-list">
            ${itemsHtml}
          </div>

          <div class="footer">
            Generated on ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            <br>
            Powered by Research Tracker Premium 3.0
          </div>
        </div>
      </body>
      </html>
    `;
    }
}
