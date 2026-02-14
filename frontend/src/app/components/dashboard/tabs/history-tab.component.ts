import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-history-tab',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="reveal">
      <div class="p-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem;">
          <h2 style="font-family: var(--font-display); font-size: 1.5rem;">System Audit Log</h2>
          <span class="p-badge" style="background: var(--p-bg-alt); padding: 6px 14px;">{{ totalEvents }} Total Events</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 2.5rem;">
          @for (group of groupedHistory; track group.date) {
            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
              <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="padding: 4px 12px; background: var(--p-text); color: white; border-radius: 8px; font-size: 0.75rem; font-weight: 800;">
                  {{ group.date }}
                </div>
                <div style="flex: 1; height: 1px; background: var(--p-border);"></div>
              </div>

              <div style="display: flex; flex-direction: column; gap: 1rem; padding-left: 1rem; border-left: 2px solid var(--p-border);">
                @for (log of group.items; track log.id) {
                  <div style="display: flex; gap: 1.5rem; align-items: flex-start;">
                    <div style="width: 80px; font-size: 0.75rem; font-weight: 700; color: var(--p-text-muted); padding-top: 4px;">
                      {{ formatTime(log.timestamp) }}
                    </div>
                    
                    <div class="p-card" style="flex: 1; padding: 1rem 1.5rem; border-radius: 14px; background: white;">
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                         <span class="p-badge" [attr.data-status]="log.changeType" style="font-size: 0.6rem;">{{ log.changeType }}</span>
                         <span style="font-size: 0.7rem; font-weight: 800; color: var(--p-text-muted);">ID #{{ log.researchId }}</span>
                      </div>
                      <div style="font-size: 0.9rem; line-height: 1.5;">
                        @if (log.changeType === 'CREATE') {
                          Paper added to the central repository.
                        } @else if (log.changeType === 'DELETE') {
                          Paper removed from the records.
                        } @else {
                          Modified <b>{{ log.fieldName }}</b>: 
                          <span style="opacity: 0.6; text-decoration: line-through; padding: 0 4px;">{{ log.oldValue || 'none' }}</span> 
                          → <span style="color: var(--p-accent); font-weight: 700;">{{ log.newValue }}</span>
                        }
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          } @empty {
             <div style="text-align: center; padding: 5rem;">
                <div style="font-size: 3rem; margin-bottom: 1.5rem;">🕒</div>
                <p style="color: var(--p-text-muted); font-weight: 600;">System logs are currently empty.</p>
             </div>
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
