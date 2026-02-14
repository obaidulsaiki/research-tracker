import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="app-header">
      <div class="header-path" style="display: flex; align-items: center;">
        <span class="path-current" style="font-weight: 800; color: var(--p-text); font-size: 1.1rem; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.9;">{{ activeTab }}</span>
      </div>
      
      <div class="header-actions" style="flex: 1; display: flex; justify-content: flex-end; align-items: center; gap: 2.5rem;">
        <div class="search-wrapper">
          <i>🔍</i>
          <input type="text" placeholder="Search entries, authors, or publication keys..." (input)="onSearch($event)">
        </div>
        
        <div style="display: flex; gap: 1rem; align-items: center;">
          <div style="display: flex; gap: 0.5rem; background: var(--p-bg-subtle); padding: 0.4rem; border-radius: 12px; border: 1px solid var(--p-border);">
            <button class="btn-glass" style="padding: 0.5rem 1rem; border: none; background: transparent; box-shadow: none; font-size: 0.8rem;" (click)="xlsInput.click()">📗 Excel</button>
            <button class="btn-glass" style="padding: 0.5rem 1rem; border: none; background: transparent; box-shadow: none; font-size: 0.8rem;" (click)="csvInput.click()">📥 CSV</button>
          </div>
          
          <input type="file" #xlsInput (change)="onExcelSelected($event)" accept=".xlsx, .xls" style="display: none">
          <input type="file" #csvInput (change)="onFileSelected($event)" accept=".csv" style="display: none">
          
          <button class="btn-vibrant" (click)="onAddResearch.emit()" style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.2rem;">+</span> Add Paper
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    :host { display: contents; }
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
