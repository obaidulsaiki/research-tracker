import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-download-tab',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="reveal">
      <div class="stat-grid" style="grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));">
        <!-- EXCEL DOWNLOAD -->
        <div class="p-card" style="text-align: center; border-bottom: 6px solid #10b981;">
          <div style="font-size: 3.5rem; margin-bottom: 1.5rem;">📊</div>
          <h3 style="font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 1rem;">Export to Excel</h3>
          <p style="color: var(--p-text-muted); font-size: 0.95rem; margin-bottom: 2rem; line-height: 1.6;">
            Download your entire archive as a spreadsheet optimized for Microsoft Excel and advanced analysis.
          </p>
          <div style="margin-bottom: 2rem;">
            <span class="p-badge" style="background: #10b98120; color: #059669; padding: 8px 16px;">{{ itemCount }} Total Records</span>
          </div>
          <button class="btn-vibrant" style="width: 100%;" (click)="onExcel.emit()">Generate XLSX</button>
        </div>

        <!-- PDF DOWNLOAD -->
        <div class="p-card" style="text-align: center; border-bottom: 6px solid var(--p-accent);">
          <div style="font-size: 3.5rem; margin-bottom: 1.5rem;">📄</div>
          <h3 style="font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 1rem;">Professional PDF</h3>
          <p style="color: var(--p-text-muted); font-size: 0.95rem; margin-bottom: 2rem; line-height: 1.6;">
            Generate a high-end PDF portfolio summary suitable for academic applications and CV inclusion.
          </p>
          <div style="margin-bottom: 2rem;">
            <span class="p-badge" style="background: var(--p-accent-muted); color: var(--p-accent); padding: 8px 16px;">Premium Layout</span>
          </div>
          <button class="btn-vibrant" style="width: 100%;" (click)="onPdf.emit()">Download Portfolio</button>
        </div>

        <!-- CSV DOWNLOAD -->
        <div class="p-card" style="text-align: center; border-bottom: 6px solid var(--p-text-muted);">
          <div style="font-size: 3.5rem; margin-bottom: 1.5rem;">💾</div>
          <h3 style="font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 1rem;">Standard CSV</h3>
          <p style="color: var(--p-text-muted); font-size: 0.95rem; margin-bottom: 2rem; line-height: 1.6;">
            Download a portable data file compatible with all major data science and management tools.
          </p>
          <div style="margin-bottom: 2rem;">
            <span class="p-badge" style="background: var(--p-bg-alt); padding: 8px 16px;">Legacy Support</span>
          </div>
          <button class="btn-glass" style="width: 100%; font-weight: 700;" (click)="onCsv.emit()">Download CSV</button>
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
