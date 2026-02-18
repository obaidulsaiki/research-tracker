import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="app-header">
      <div class="header-breadcrumb">
        <span class="path-current">{{ activeTab }}</span>
      </div>
      
        <div class="header-actions">
          <div class="search-wrapper">
            <span class="search-icon">🔍</span>
            <input type="text" placeholder="Search entries, authors, or publication keys..." (input)="onSearch($event)">
          </div>
          
          <div class="ingestion-group">
            <div class="import-section">
              <span class="ingestion-label">IMPORT DATA</span>
              <div class="import-buttons">
                <button class="btn-glass import-btn" (click)="xlsInput.click()" title="Import records from an Excel (.xlsx) file">
                  <span class="btn-emoji">📗</span> Excel
                </button>
                <div class="btn-divider"></div>
                <button class="btn-glass import-btn" (click)="csvInput.click()" title="Import records from a CSV file">
                  <span class="btn-emoji">📤</span> CSV
                </button>
              </div>
            </div>
            
            <button class="btn-vibrant add-btn" (click)="onAddResearch.emit()">
              <span class="add-icon">+</span> Add Paper
            </button>
          </div>
          
          <input type="file" #xlsInput (change)="onExcelSelected($event)" accept=".xlsx, .xls" style="display: none">
          <input type="file" #csvInput (change)="onFileSelected($event)" accept=".csv" style="display: none">
        </div>
    </header>
  `,
  styles: [`
    :host { display: contents; }
    .app-header {
      padding: 0 1.5rem; display: flex; justify-content: space-between; align-items: center;
      background: var(--p-surface); border-bottom: 1px solid var(--p-bg-subtle);
      position: sticky; top: 0; z-index: 100;
      backdrop-filter: var(--p-glass); height: 72px;
    }
    .header-breadcrumb { flex: 0 0 200px; display: flex; align-items: center; }
    .path-current { 
      font-weight: 800; color: var(--p-text); font-size: 0.95rem; 
      text-transform: uppercase; letter-spacing: 1.5px;
      font-family: var(--font-display);
    }

    .header-actions { flex: 1; display: flex; justify-content: center; align-items: center; gap: 2rem; }
    
    .search-wrapper {
      position: relative; flex: 1; max-width: 400px;
    }
    .search-icon {
      position: absolute; left: 1rem; top: 50%; transform: translateY(-50%);
      font-size: 0.9rem; opacity: 0.5;
    }
    .search-wrapper input {
      width: 100%; padding: 0.5rem 1rem 0.5rem 2.25rem;
      background: var(--p-bg-subtle); border: 1px solid var(--p-border);
      border-radius: 10px; font-size: 0.8rem; color: var(--p-text);
      transition: all 0.2s ease;
    }
    .search-wrapper input:focus {
      background: white; border-color: var(--p-accent); outline: none;
      box-shadow: 0 0 0 3px var(--p-accent-glow);
    }

    .ingestion-group { display: flex; gap: 1rem; align-items: center; }
    
    .import-section { display: flex; flex-direction: column; gap: 0.35rem; align-items: center; }
    .ingestion-label { 
      font-size: 0.55rem; font-weight: 900; color: var(--p-accent); 
      letter-spacing: 1.5px; opacity: 0.7;
      text-transform: uppercase;
    }
    
    .import-buttons {
      display: flex; align-items: center; background: white; 
      padding: 0.6rem 1rem; border-radius: 12px; border: 1.5px solid var(--p-border);
      height: 44px; box-shadow: var(--p-shadow-sm);
    }
    .import-btn {
      padding: 0 0.85rem; border: none; background: transparent; 
      box-shadow: none; font-size: 0.75rem; font-weight: 700;
      color: var(--p-text-muted); display: flex; align-items: center; gap: 0.4rem;
      height: 100%;
    }
    .import-btn:hover { background: white; color: var(--p-text); border-radius: 8px; transform: none; }
    .btn-divider { width: 1px; height: 18px; background: var(--p-border); margin: 0 0.25rem; }
    .btn-emoji { font-size: 1rem; }

    .add-btn { display: flex; align-items: center; gap: 0.4rem; height: 42px; font-size: 0.85rem; padding: 0 1.25rem; }
    .add-icon { font-size: 1.2rem; font-weight: 300; }
  `]
})
export class HeaderComponent {
  @Input() activeTab: string = 'overview';

  @Output() search = new EventEmitter<string>();
  @Output() onExport = new EventEmitter<void>();
  @Output() onAddResearch = new EventEmitter<void>();
  @Output() excelSelected = new EventEmitter<Event>();
  @Output() fileSelected = new EventEmitter<Event>();

  onSearch(event: any) {
    this.search.emit(event.target.value);
  }

  onExcelSelected(event: Event) {
    this.excelSelected.emit(event);
  }

  onFileSelected(event: Event) {
    this.fileSelected.emit(event);
  }
}
