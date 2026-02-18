import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-download-tab',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="download-container animate-reveal">
      <div class="stat-grid">
        <!-- EXCEL DOWNLOAD -->
        <div class="p-card export-card excel">
          <div class="export-icon">📊</div>
          <h3 class="export-title">Export to Excel</h3>
          <p class="export-desc">
            Download your entire archive as a spreadsheet optimized for Microsoft Excel and advanced analysis.
          </p>
          <div class="export-meta">
            <span class="p-badge count-badge">{{ itemCount }} Total Records</span>
          </div>
          <button class="btn-vibrant export-btn" (click)="onExcel.emit()">Generate XLSX</button>
        </div>

        <!-- PDF DOWNLOAD -->
        <div class="p-card export-card pdf">
          <div class="export-icon">📄</div>
          <h3 class="export-title">Professional PDF</h3>
          <p class="export-desc">
            Generate a high-end PDF portfolio summary suitable for academic applications and CV inclusion.
          </p>
          <div class="export-meta">
            <span class="p-badge premium-badge">Premium Layout</span>
          </div>
          <button class="btn-vibrant export-btn" (click)="onPdf.emit()">Download Portfolio</button>
        </div>

        <!-- CSV DOWNLOAD -->
        <div class="p-card export-card csv">
          <div class="export-icon">💾</div>
          <h3 class="export-title">Standard CSV</h3>
          <p class="export-desc">
            Download a portable data file compatible with all major data science and management tools.
          </p>
          <div class="export-meta">
            <span class="p-badge legacy-badge">Legacy Support</span>
          </div>
          <button class="btn-glass export-btn" (click)="onCsv.emit()">Download CSV</button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: contents; }
    .download-container { padding: 1rem 0; }
    .stat-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .export-card {
      text-align: center; display: flex; flex-direction: column; align-items: center;
      padding: 1.5rem 1.25rem; transition: all 0.3s ease;
      background: var(--p-surface); border: 1px solid var(--p-border);
      border-radius: 16px; box-shadow: var(--p-shadow);
    }
    .export-card:hover { transform: translateY(-4px); box-shadow: var(--p-shadow-lg); }

    .export-card.excel { border-bottom: 6px solid var(--p-success); }
    .export-card.pdf { border-bottom: 6px solid var(--p-accent); }
    .export-card.csv { border-bottom: 6px solid var(--p-text-muted); }

    .export-icon { font-size: 2rem; margin-bottom: 0.75rem; }
    .export-title { 
      font-family: var(--font-display); font-size: 1.1rem; font-weight: 800; 
      color: var(--p-text); margin-bottom: 0.5rem; 
    }
    .export-desc {
      color: var(--p-text-muted); font-size: 0.78rem; margin-bottom: 1rem; 
      line-height: 1.5; max-width: 240px;
    }

    .export-meta { margin-bottom: 1.5rem; }
    .p-badge { padding: 0.5rem 1rem; border-radius: 50px; font-weight: 800; font-size: 0.75rem; }
    .count-badge { background: var(--p-success-bg); color: var(--p-success); }
    .premium-badge { background: var(--p-accent-glow); color: var(--p-accent); }
    .legacy-badge { background: var(--p-bg-subtle); color: var(--p-text-muted); border: 1px solid var(--p-border); }

    .export-btn { width: 100%; height: 40px; border-radius: 12px; font-weight: 800; font-size: 0.8rem; }
  `]
})
export class DownloadTabComponent {
  @Input() itemCount: number = 0;
  @Output() onExcel = new EventEmitter<void>();
  @Output() onPdf = new EventEmitter<void>();
  @Output() onCsv = new EventEmitter<void>();
}
