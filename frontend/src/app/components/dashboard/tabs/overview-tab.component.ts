import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-overview-tab',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="reveal" style="display: flex; flex-direction: column; gap: 3.5rem;">
      <!-- STATS VISUALIZATION -->
      <div class="stat-grid">
         @for (stat of stats; track stat.label) {
           <div class="p-card stat-item" style="padding: 2rem; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; gap: 1rem;">
             <div style="width: 64px; height: 64px; background: var(--p-gradient-soft); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 0.5rem; border: 2px solid var(--p-border);">
                {{ getStatIcon(stat.label) }}
             </div>
             <div>
               <div style="font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: var(--p-text-muted); margin-bottom: 0.5rem;">{{ stat.label }}</div>
               <div style="font-size: 2.25rem; font-weight: 900; family: var(--font-display); color: var(--p-text); line-height: 1;">{{ stat.value }}</div>
             </div>
             
             <!-- MINI GRAPH DECORATION -->
             <svg width="60" height="20" style="margin-top: 1rem; opacity: 0.4;">
                <path d="M0 20 Q 15 5, 30 15 T 60 5" fill="none" [attr.stroke]="stat.value > 0 ? 'var(--p-accent)' : '#94a3b8'" stroke-width="2.5" />
             </svg>
           </div>
         }
      </div>

      <div class="view-split" style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 3rem;">
        <!-- DYNAMIC ANALYSIS CHART -->
        <div class="p-card" style="min-height: 480px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem;">
            <div>
              <h3 style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; letter-spacing: -0.5px;">Activity Insights</h3>
              <p style="font-size: 0.85rem; color: var(--p-text-muted); font-weight: 500;">Engagement and research intensity over time</p>
            </div>
            <button class="btn-glass" style="padding: 0.6rem 1.25rem; font-size: 0.8rem; font-weight: 700;" (click)="viewAllHistory.emit()">Full Audit Log</button>
          </div>
          
          <!-- ANALYTICS VISUALIZER -->
          <div style="padding: 2rem; background: var(--p-bg-subtle); border-radius: 12px; height: 300px; position: relative; overflow: hidden; display: flex; align-items: flex-end; gap: 1rem;">
              @for (h of [80, 40, 100, 60, 90, 70, 110]; track $index) {
                <div [style.height.%]="h" [style.background]="'var(--p-gradient)'" style="flex: 1; border-radius: 8px 8px 0 0; position: relative;">
                  <div style="position: absolute; top: -25px; left: 50%; transform: translateX(-50%); font-size: 0.6rem; font-weight: 800; color: var(--p-accent);">{{ h }}%</div>
                </div>
              }
              <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 1px; background: var(--p-border);"></div>
          </div>
          
          <div style="margin-top: 2rem; display: flex; gap: 2rem;">
             <div style="display: flex; align-items: center; gap: 0.5rem;">
                <div style="width: 12px; height: 12px; background: var(--p-accent); border-radius: 3px;"></div>
                <span style="font-size: 0.75rem; font-weight: 700; color: var(--p-text-muted);">Research Capacity</span>
             </div>
             <div style="display: flex; align-items: center; gap: 0.5rem;">
                <div style="width: 12px; height: 12px; background: var(--p-bg-alt); border-radius: 3px;"></div>
                <span style="font-size: 0.75rem; font-weight: 700; color: var(--p-text-muted);">Baseline</span>
             </div>
          </div>
        </div>

        <!-- RECENT ACTIVITY FEED -->
        <div class="p-card" style="background: white;">
          <h3 style="font-family: var(--font-display); font-size: 1.25rem; margin-bottom: 2rem; font-weight: 800;">Recent Stream</h3>
          
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            @for (item of history | slice:0:5; track item.id) {
              <div style="display: flex; gap: 1.25rem; align-items: flex-start; position: relative; padding-bottom: 0.5rem;">
                <div style="width: 10px; height: 10px; border-radius: 50%; background: var(--p-accent); margin-top: 5px; flex-shrink: 0; box-shadow: 0 0 10px var(--p-accent-glow);"></div>
                @if (!$last) {
                    <div style="position: absolute; left: 4.5px; top: 15px; bottom: -10px; width: 1px; background: var(--p-border);"></div>
                }
                <div style="flex: 1;">
                  <div style="font-weight: 700; font-size: 0.85rem; color: var(--p-text);">{{ item.changeType }}</div>
                  <div style="font-size: 0.8rem; color: var(--p-text-muted); opacity: 0.8; margin-top: 2px;">{{ item.newValue }}</div>
                  <div style="font-size: 0.7rem; font-weight: 800; color: var(--p-accent); text-transform: uppercase; margin-top: 4px;">{{ formatTime(item.timestamp) }}</div>
                </div>
              </div>
            } @empty {
              <div style="text-align: center; padding: 4rem; opacity: 0.4;">
                  <div style="font-size: 2.5rem; margin-bottom: 1rem;">💤</div>
                  <div style="font-weight: 800; font-size: 0.9rem;">Clean Stream</div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- SYSTEM STATUS BANNER -->
      <div class="p-card" style="background: var(--p-gradient); color: white; display: flex; align-items: center; justify-content: space-between; padding: 2rem 3rem;">
        <div style="display: flex; align-items: center; gap: 2rem;">
            <div style="width: 54px; height: 54px; background: rgba(255,255,255,0.2); border-radius: 14px; backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">🛡️</div>
            <div>
                <h3 style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 800;">Research Infrastructure</h3>
                <p style="opacity: 0.8; font-size: 0.85rem; font-weight: 500;">Metadata synchronization via Crossref API is active.</p>
            </div>
        </div>
        
        <div style="display: flex; gap: 1.5rem;">
            <div style="background: rgba(255,255,255,0.1); padding: 0.75rem 1.25rem; border-radius: 12px; backdrop-filter: blur(4px); display: flex; align-items: center; gap: 0.75rem; border: 1px solid rgba(255,255,255,0.15);">
                <div style="width: 8px; height: 8px; border-radius: 50%; background: #4ade80;"></div>
                <span style="font-size: 0.75rem; font-weight: 800;">DB SYNCED</span>
            </div>
            <div style="background: rgba(255,255,255,0.1); padding: 0.75rem 1.25rem; border-radius: 12px; backdrop-filter: blur(4px); display: flex; align-items: center; gap: 0.75rem; border: 1px solid rgba(255,255,255,0.15);">
                <div style="width: 8px; height: 8px; border-radius: 50%; background: #4ade80;"></div>
                <span style="font-size: 0.75rem; font-weight: 800;">BACKEND LIVE</span>
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

  getStatIcon(label: string): string {
    const l = label.toLowerCase();
    if (l.includes('total')) return '📊';
    if (l.includes('working')) return '🛠️';
    if (l.includes('accepted')) return '✅';
    if (l.includes('published')) return '🌎';
    return '📝';
  }

  formatTime(dateStr: string): string {
    if (!dateStr) return '---';
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
