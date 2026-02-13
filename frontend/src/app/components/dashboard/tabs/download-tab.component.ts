import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-download-tab',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="view-tab animate-fade-in">
      <div class="analytics-grid">
        <!-- EXCEL DOWNLOAD -->
        <div class="data-card download-card slide-up">
          <div class="download-icon excel">📊</div>
          <div class="download-info">
            <h3>Export to Excel</h3>
            <p>Download your entire archive as a spreadsheet (.csv) optimized for Microsoft Excel and analysis.</p>
            <span class="badge-count">{{ itemCount }} Records</span>
          </div>
          <button class="btn-primary" style="width: 100%; justify-content: center;" (click)="onExcel.emit()">Download XLSX</button>
        </div>

        <!-- PDF DOWNLOAD -->
        <div class="data-card download-card slide-up" style="animation-delay: 0.1s">
          <div class="download-icon pdf">📄</div>
          <div class="download-info">
            <h3>Export to PDF</h3>
            <p>Generate a professional PDF summary of your research portfolio using native print optimization.</p>
            <span class="badge-count">{{ itemCount }} Records</span>
          </div>
          <button class="btn-primary" style="width: 100%; justify-content: center;" (click)="onPdf.emit()">Download PDF</button>
        </div>

        <!-- CSV DOWNLOAD -->
        <div class="data-card download-card slide-up" style="animation-delay: 0.2s">
          <div class="download-icon csv">📄</div>
          <div class="download-info">
            <h3>Export to CSV</h3>
            <p>Download a raw data file (.csv) compatible with all major scientific and data management tools.</p>
            <span class="badge-count">{{ itemCount }} Records</span>
          </div>
          <button class="btn-secondary" style="width: 100%; justify-content: center;" (click)="onCsv.emit()">Download CSV</button>
        </div>
      </div>
    </section>
  `,
    styles: [`
    :host { display: contents; }
  `]
})
export class DownloadTabComponent {
    @Input() itemCount: number = 0;
    @Output() onExcel = new EventEmitter<void>();
    @Output() onPdf = new EventEmitter<void>();
    @Output() onCsv = new EventEmitter<void>();
}
