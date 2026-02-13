import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dashboard-sidebar',
    standalone: true,
    imports: [CommonModule],
    template: `
    <aside class="app-sidebar fade-up">
      <div class="sidebar-header">
        <div class="brand-icon">📜</div>
        <div class="brand-name">Res<b>Track</b></div>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-label">Core View</div>
        <button [class.active]="activeTab === 'overview'" (click)="tabChange.emit('overview')">
          <span>🏠</span> Overview
        </button>
        <button [class.active]="activeTab === 'archive'" (click)="tabChange.emit('archive')">
          <span>📚</span> Paper Archive
        </button>
        
        <div class="nav-label">Insights</div>
        <button [class.active]="activeTab === 'authors'" (click)="tabChange.emit('authors')">
          <span>🤝</span> Co-Authors
        </button>
        <button [class.active]="activeTab === 'analytics'" (click)="tabChange.emit('analytics')">
          <span>📈</span> Analytics
        </button>
        <button [class.active]="activeTab === 'history'" (click)="tabChange.emit('history')">
          <span>🕒</span> Audit Log
        </button>
        <button [class.active]="activeTab === 'download'" (click)="tabChange.emit('download')">
          <span>📥</span> Download
        </button>
      </nav>

      <div class="sidebar-footer">
        <button class="btn-share" (click)="onViewPortfolio.emit()">🌐 Public Profile</button>
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
