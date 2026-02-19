import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService, SystemSettings } from '../../../services/settings.service';

@Component({
  selector: 'app-download-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

        <!-- BACKUP SETTINGS -->
        <div class="p-card export-card backup">
          <div class="export-icon">🛡️</div>
          <h3 class="export-title">Auto Backup to File</h3>
          <p class="export-desc">
            Automatically sync your database to a local file on the server at fixed intervals.
          </p>
          
          @if (settingsService.settings(); as s) {
            <div class="backup-controls">
              <div class="toggle-row">
                 <label class="switch">
                    <input type="checkbox" [checked]="s.autoBackupEnabled" (change)="toggleBackup(s)">
                    <span class="slider round"></span>
                 </label>
                 <span class="toggle-label">{{ s.autoBackupEnabled ? 'Enabled' : 'Disabled' }}</span>
              </div>

              @if (s.autoBackupEnabled) {
                <div class="interval-row">
                   <label>Frequency:</label>
                   <select class="settings-select" [ngModel]="s.backupIntervalHours" (ngModelChange)="updateInterval(s, $event)">
                      <option [ngValue]="4">Every 4 Hours</option>
                      <option [ngValue]="12">Every 12 Hours</option>
                      <option [ngValue]="24">Every 24 Hours</option>
                   </select>
                </div>
              }

              @if (s.lastBackupTime) {
                <div class="last-backup">
                   Last: {{ formatDate(s.lastBackupTime) }}
                </div>
              }
            </div>
          }

          <button class="btn-outline export-btn" style="margin-top: 1rem" (click)="manualBackup()">Backup Now</button>
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
      min-height: 320px;
    }
    .export-card:hover { transform: translateY(-4px); box-shadow: var(--p-shadow-lg); }

    .export-card.excel { border-bottom: 6px solid var(--p-success); }
    .export-card.pdf { border-bottom: 6px solid var(--p-accent); }
    .export-card.csv { border-bottom: 6px solid var(--p-text-muted); }
    .export-card.backup { border-bottom: 6px solid #6366f1; }

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

    .export-btn { width: 100%; height: 40px; border-radius: 12px; font-weight: 800; font-size: 0.8rem; margin-top: auto; border: none; cursor: pointer; }
    .btn-vibrant { background: var(--p-accent); color: white; }
    .btn-glass { background: var(--p-bg-subtle); color: var(--p-text-muted); border: 1px solid var(--p-border); }
    
    .backup-controls {
      width: 100%; display: flex; flex-direction: column; gap: 0.75rem;
      padding: 1rem; background: var(--p-bg-subtle); border-radius: 12px;
      margin-bottom: 1rem;
    }
    .toggle-row { display: flex; align-items: center; justify-content: center; gap: 0.75rem; }
    .toggle-label { font-size: 0.8rem; font-weight: 700; color: var(--p-text); }
    
    .interval-row { display: flex; align-items: center; gap: 0.5rem; justify-content: center; font-size: 0.8rem; }
    .settings-select {
      background: white; border: 1px solid var(--p-border); border-radius: 4px; padding: 2px 4px;
      font-weight: 700; font-size: 0.75rem;
    }

    .last-backup { font-size: 0.7rem; color: var(--p-text-muted); font-weight: 600; font-style: italic; }

    /* Switch Style */
    .switch { position: relative; display: inline-block; width: 40px; height: 20px; }
    .switch input { opacity: 0; width: 0; height: 0; }
    .slider {
      position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
      background-color: #ccc; transition: .4s; border-radius: 34px;
    }
    .slider:before {
      position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px;
      background-color: white; transition: .4s; border-radius: 50%;
    }
    input:checked + .slider { background-color: #6366f1; }
    input:checked + .slider:before { transform: translateX(20px); }

    .btn-outline {
      background: transparent; border: 1px solid var(--p-border); color: var(--p-text);
    }
    .btn-outline:hover { background: var(--p-bg-subtle); }
  `]
})
export class DownloadTabComponent implements OnInit {
  @Input() itemCount: number = 0;
  @Output() onExcel = new EventEmitter<void>();
  @Output() onPdf = new EventEmitter<void>();
  @Output() onCsv = new EventEmitter<void>();

  protected settingsService = inject(SettingsService);

  ngOnInit() {
    this.settingsService.loadSettings();
  }

  toggleBackup(s: SystemSettings) {
    const updated = { ...s, autoBackupEnabled: !s.autoBackupEnabled };
    this.settingsService.updateSettings(updated).subscribe();
  }

  updateInterval(s: SystemSettings, hours: number) {
    const updated = { ...s, backupIntervalHours: hours };
    this.settingsService.updateSettings(updated).subscribe();
  }

  manualBackup() {
    this.settingsService.triggerManualBackup().subscribe({
      next: () => alert('✨ Manual backup completed successfully!')
    });
  }

  formatDate(dateStr: string) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleString();
  }
}
