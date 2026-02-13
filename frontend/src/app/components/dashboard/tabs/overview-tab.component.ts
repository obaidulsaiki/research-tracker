import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-overview-tab',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="view-tab">
      <div class="stat-dense-grid">
         @for (stat of stats; track stat.label) {
           <div class="data-card stat-item">
             <span class="stat-label">{{ stat.label }}</span>
             <span class="stat-value">{{ stat.value }}</span>
           </div>
         }
      </div>

      <div class="view-split">
        <div class="data-card recent-list">
          <div class="card-header">
            <h3>Recent Events</h3>
            <button class="btn-link" (click)="viewAllHistory.emit()">View all</button>
          </div>
          <div class="event-stack">
            @for (item of history; track item.id) {
              <div class="event-item">
                <span class="event-time">{{ formatTime(item.timestamp) }}</span>
                <span class="event-msg"><b>{{ item.changeType }}</b> updated to "{{ item.newValue }}"</span>
              </div>
            } @empty {
              <div class="empty-state">No recent activity logged.</div>
            }
          </div>
        </div>

        <div class="data-card monitor-box">
          <div class="card-header">
            <h3>Monitoring Status</h3>
          </div>
          <div class="monitor-content">
            <div class="monitor-row">
              <span class="m-label">Database Sync</span>
              <span class="m-val online">Connected</span>
            </div>
            <div class="monitor-row">
              <span class="m-label">Export Cache</span>
              <span class="m-val">Ready</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
    styles: [`
    :host { display: contents; }
  `]
})
export class OverviewTabComponent {
    @Input() stats: any[] = [];
    @Input() history: any[] = [];
    @Output() viewAllHistory = new EventEmitter<void>();

    formatTime(dateStr: string): string {
        if (!dateStr) return '---';
        const d = new Date(dateStr);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}
