import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside class="app-sidebar reveal">
      <div class="rt-logo-container">
        <div class="rt-logo-text">Research-Tracker</div>
      </div>
      
      <nav class="nav-section">
        <div class="nav-title">Primary</div>
        <div class="nav-item" [class.active]="activeTab === 'overview'" (click)="tabChange.emit('overview')">
          <span class="nav-icon">🏠</span> Dashboard
        </div>
        <div class="nav-item" [class.active]="activeTab === 'archive'" (click)="tabChange.emit('archive')">
          <span class="nav-icon">📚</span> Archive
        </div>
        <div class="nav-item" [class.active]="activeTab === 'deadlines'" (click)="tabChange.emit('deadlines')">
          <span class="nav-icon">📅</span> Deadlines
        </div>
      </nav>

      <nav class="nav-section">
        <div class="nav-title">Analysis</div>
        <div class="nav-item" [class.active]="activeTab === 'authors'" (click)="tabChange.emit('authors')">
          <span class="nav-icon">🤝</span> Authors
        </div>
        <div class="nav-item" [class.active]="activeTab === 'analytics'" (click)="tabChange.emit('analytics')">
          <span class="nav-icon">📈</span> Insights
        </div>
        <div class="nav-item" [class.active]="activeTab === 'history'" (click)="tabChange.emit('history')">
          <span class="nav-icon">🕒</span> Audit
        </div>
        <div class="nav-item" [class.active]="activeTab === 'download'" (click)="tabChange.emit('download')">
          <span class="nav-icon">📤</span> Export
        </div>
      </nav>

      <div class="sidebar-footer">
        <button class="btn-floating-vibrant" (click)="onViewPortfolio.emit()">
          <span>🌐</span> View Public Profile
        </button>
      </div>
    </aside>
  `,
  styles: [`
    :host { display: contents; }
  `]
})
export class SidebarComponent {
  @Input() activeTab: string = 'overview';
  @Output() tabChange = new EventEmitter<string>();
  @Output() onViewPortfolio = new EventEmitter<void>();
}
