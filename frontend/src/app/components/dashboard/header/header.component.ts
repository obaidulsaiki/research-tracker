import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dashboard-header',
    standalone: true,
    imports: [CommonModule],
    template: `
    <header class="app-header">
      <div class="header-path">
        <span class="path-root">Dashboard</span>
        <span class="path-sep">/</span>
        <span class="path-current">{{ activeTab | titlecase }}</span>
      </div>
      
      <div class="header-actions">
        <div class="search-input">
          <span>🔍</span>
          <input type="text" placeholder="Filter research..." (input)="onSearch($event)">
        </div>
        <button class="btn-secondary" (click)="onExport.emit()">📤 Export</button>
        <button class="btn-secondary" (click)="xlsInput.click()">📗 Excel Import</button>
        <button class="btn-secondary" (click)="csvInput.click()">📥 CSV Import</button>
        <input type="file" #xlsInput (change)="onExcelSelected($event)" accept=".xlsx, .xls" style="display: none">
        <input type="file" #csvInput (change)="onFileSelected($event)" accept=".csv" style="display: none">
        <button class="btn-primary" (click)="onAddResearch.emit()">+ Add Research</button>
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
