import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-history-tab',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="view-tab animate-fade-in">
      <div class="data-card timeline-pane">
        <div class="timeline-header">
          <h3>System Audit Log</h3>
          <span class="badge-count">{{ totalEvents }} Events</span>
        </div>

        <div class="timeline-container">
          @for (group of groupedHistory; track group.date) {
            <div class="timeline-group">
              <div class="timeline-date-marker">
                <span>{{ group.date }}</span>
              </div>

              <div class="timeline-items">
                @for (log of group.items; track log.id) {
                  <div class="timeline-row slide-up">
                    <div class="timeline-axis">
                      <div class="axis-node" [attr.data-type]="log.changeType"></div>
                      <div class="axis-line"></div>
                    </div>

                    <div class="timeline-card">
                      <div class="t-meta">
                        <span class="t-badge" [attr.data-type]="log.changeType">{{ log.changeType }}</span>
                        <span class="t-time">{{ formatTime(log.timestamp) }}</span>
                      </div>
                      <div class="t-content">
                        @if (log.changeType === 'CREATE') {
                          <p>New research paper <b>#{{ log.researchId }}</b> was added to the database.</p>
                        } @else if (log.changeType === 'DELETE') {
                          <p>Research paper <b>#{{ log.researchId }}</b> was removed.</p>
                        } @else {
                          <p>
                            Paper <b>#{{ log.researchId }}</b>: field <i>{{ log.fieldName }}</i>
                            changed from <span class="old">{{ log.oldValue || 'none' }}</span>
                            to <b class="new">{{ log.newValue }}</b>
                          </p>
                        }
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          } @empty {
            <div class="empty-state">No audit logs available yet.</div>
          }
        </div>
      </div>
    </section>
  `,
    styles: [`
    :host { display: contents; }
  `]
})
export class HistoryTabComponent {
    @Input() groupedHistory: any[] = [];
    @Input() totalEvents: number = 0;

    formatTime(dateStr: string): string {
        if (!dateStr) return '---';
        const d = new Date(dateStr);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}
