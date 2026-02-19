import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-overview-tab',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="overview-container animate-reveal">
      <!-- STATS VISUALIZATION -->
      <div class="stat-grid">
         @for (stat of stats; track stat.label) {
           <div class="p-card stat-item interactive" (click)="statClick.emit(stat.label)">
             <div class="stat-bubble">
                {{ getStatIcon(stat.label) }}
             </div>
             <div class="stat-content">
               <div class="stat-label">{{ stat.label }}</div>
               <div class="stat-value">{{ stat.value }}</div>
             </div>
             
             <!-- MINI GRAPH DECORATION -->
             <svg width="60" height="20" class="mini-graph">
                <path d="M0 20 Q 15 5, 30 15 T 60 5" fill="none" [attr.stroke]="stat.value > 0 ? 'var(--p-accent)' : '#94a3b8'" stroke-width="2.5" />
             </svg>
           </div>
         }
      </div>

      <div class="view-split">
        <!-- DYNAMIC ANALYSIS CHART -->
        <div class="p-card chart-card">
          <div class="chart-header">
            <div class="chart-titles">
              <h3 class="chart-title">Activity Insights</h3>
              <p class="chart-subtitle">Engagement and research intensity over time</p>
            </div>
            <button class="btn-glass audit-btn" (click)="viewAllHistory.emit()">Full Audit Log</button>
          </div>
          
          <!-- ANALYTICS VISUALIZER -->
          <div class="visualizer">
              @for (h of [80, 40, 100, 60, 90, 70, 110]; track $index) {
                <div class="bar" [style.height.%]="h">
                  <div class="bar-value">{{ h }}%</div>
                </div>
              }
              <div class="baseline"></div>
          </div>
          
          <div class="chart-legend">
             <div class="legend-item">
                <div class="legend-dot accent"></div>
                <span>Research Capacity</span>
             </div>
             <div class="legend-item">
                <div class="legend-dot baseline-dot"></div>
                <span>Baseline</span>
             </div>
          </div>
        </div>

        <!-- RECENT ACTIVITY FEED -->
        <div class="p-card activity-card">
          <h3 class="activity-title">Recent Stream</h3>
          
          <div class="activity-feed">
            @for (item of history | slice:0:5; track item.id) {
              <div class="feed-item" [class.latest]="$first">
                <div class="feed-dot"></div>
                @if (!$last) {
                    <div class="feed-line"></div>
                }
                <div class="feed-content">
                  <div class="change-type">{{ item.changeType }}</div>
                  <div class="change-value">{{ item.newValue }}</div>
                  <div class="change-time">{{ formatTime(item.timestamp) }}</div>
                </div>
              </div>
            } @empty {
              <div class="empty-feed">
                  <div class="empty-icon">💤</div>
                  <div class="empty-text">Clean Stream</div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- SYSTEM STATUS BANNER -->
      <div class="p-card status-banner">
        <div class="status-main">
            <div class="status-icon-box">🛡️</div>
            <div>
                <h3 class="status-title">Research Infrastructure</h3>
                <p class="status-desc">Metadata synchronization via Crossref API is active.</p>
            </div>
        </div>
        
        <div class="status-indicators">
            <div class="indicator-pill">
                <div class="indicator-dot online"></div>
                <span class="indicator-text">DB SYNCED</span>
            </div>
            <div class="indicator-pill">
                <div class="indicator-dot online"></div>
                <span class="indicator-text">BACKEND LIVE</span>
            </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: contents; }
    .overview-container { display: flex; flex-direction: column; gap: 2rem; }
    
    .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; }
    .stat-item { padding: 1.25rem; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 0.75rem; transition: all 0.3s ease; }
    .stat-item.interactive { cursor: pointer; position: relative; overflow: hidden; }
    .stat-item.interactive:hover { 
      transform: translateY(-5px); 
      border-color: var(--p-accent); 
      box-shadow: 0 10px 25px -5px var(--p-accent-glow);
    }
    .stat-item.interactive::after {
      content: 'VIEW ALL →';
      position: absolute; bottom: 0; left: 0; right: 0;
      background: var(--p-accent); color: white;
      font-size: 0.5rem; font-weight: 800; padding: 2px 0;
      transform: translateY(100%); transition: transform 0.3s ease;
    }
    .stat-item.interactive:hover::after { transform: translateY(0); }

    .stat-bubble { 
      width: 48px; height: 48px; background: var(--p-gradient-soft); border-radius: 50%; 
      display: flex; align-items: center; justify-content: center; font-size: 1.2rem; 
      border: 1.5px solid var(--p-border); 
    }
    .stat-label { font-size: 0.6rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: var(--p-text-muted); margin-bottom: 0.25rem; }
    .stat-value { font-size: 1.75rem; font-weight: 900; color: var(--p-text); line-height: 1; font-family: var(--font-display); }
    .mini-graph { margin-top: 0.5rem; opacity: 0.4; }

    .view-split { display: grid; grid-template-columns: 1.6fr 1fr; gap: 2rem; }
    .chart-card { min-height: 400px; padding: 1.5rem; }
    .chart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .chart-title { font-family: var(--font-display); font-size: 1.25rem; font-weight: 800; letter-spacing: -0.3px; }
    .chart-subtitle { font-size: 0.8rem; color: var(--p-text-muted); font-weight: 500; }
    .audit-btn { padding: 0.5rem 1rem; font-size: 0.75rem; height: 36px; }

    .visualizer { 
      padding: 1.5rem; background: var(--p-bg-subtle); border-radius: 12px; 
      height: 240px; position: relative; overflow: hidden; display: flex; 
      align-items: flex-end; gap: 0.75rem; 
    }
    .bar { flex: 1; border-radius: 6px 6px 0 0; position: relative; background: var(--p-gradient); }
    .bar-value { position: absolute; top: -20px; left: 50%; transform: translateX(-50%); font-size: 0.55rem; font-weight: 800; color: var(--p-accent); }
    .baseline { position: absolute; bottom: 0; left: 0; right: 0; height: 1px; background: var(--p-border); }

    .chart-legend { margin-top: 1.5rem; display: flex; gap: 1.5rem; }
    .legend-item { display: flex; align-items: center; gap: 0.4rem; font-size: 0.7rem; font-weight: 700; color: var(--p-text-muted); }
    .legend-dot { width: 10px; height: 10px; border-radius: 3px; }
    .legend-dot.accent { background: var(--p-accent); }
    .legend-dot.baseline-dot { background: var(--p-bg-alt); }

    .activity-card { padding: 1.5rem; background: white; }
    .activity-title { font-family: var(--font-display); font-size: 1.15rem; margin-bottom: 1.5rem; font-weight: 800; }
    .activity-feed { display: flex; flex-direction: column; gap: 1rem; }
    .feed-item { display: flex; gap: 1rem; align-items: flex-start; position: relative; padding-bottom: 0.25rem; }
    .feed-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--p-bg-alt); margin-top: 5px; flex-shrink: 0; }
    .feed-item.latest .feed-dot { background: var(--p-accent); box-shadow: 0 0 8px var(--p-accent-glow); }
    .feed-line { position: absolute; left: 3.5px; top: 15px; bottom: -10px; width: 1px; background: var(--p-border); }
    .change-type { font-weight: 700; font-size: 0.8rem; color: var(--p-text); }
    .change-value { font-size: 0.75rem; color: var(--p-text-muted); opacity: 0.8; margin-top: 1px; }
    .change-time { font-size: 0.65rem; font-weight: 800; color: var(--p-accent); text-transform: uppercase; margin-top: 2px; }

    .empty-feed { text-align: center; padding: 3rem; opacity: 0.4; }
    .empty-icon { font-size: 2rem; margin-bottom: 0.5rem; }
    .empty-text { font-weight: 800; font-size: 0.8rem; }

    .status-banner { 
      background: var(--p-gradient); color: white; display: flex; 
      align-items: center; justify-content: space-between; padding: 1.25rem 2rem; 
      border-radius: 16px;
    }
    .status-main { display: flex; align-items: center; gap: 1.5rem; }
    .status-icon-box { 
      width: 42px; height: 42px; background: rgba(255,255,255,0.2); 
      border-radius: 10px; backdrop-filter: blur(8px); display: flex; 
      align-items: center; justify-content: center; font-size: 1.25rem; 
    }
    .status-title { font-family: var(--font-display); font-size: 1.1rem; font-weight: 800; margin-bottom: 0.1rem; }
    .status-desc { opacity: 0.8; font-size: 0.75rem; font-weight: 500; }
    
    .status-indicators { display: flex; gap: 1rem; }
    .indicator-pill { 
      background: rgba(255,255,255,0.1); padding: 0.5rem 1rem; border-radius: 10px; 
      backdrop-filter: blur(4px); display: flex; align-items: center; gap: 0.5rem; 
      border: 1px solid rgba(255,255,255,0.15); 
    }
    .indicator-dot { width: 6px; height: 6px; border-radius: 50%; }
    .indicator-dot.online { background: #4ade80; box-shadow: 0 0 6px #4ade80; }
    .indicator-text { font-size: 0.65rem; font-weight: 800; }
  `]
})
export class OverviewTabComponent {
  @Input() stats: any[] = [];
  @Input() history: any[] = [];
  @Output() viewAllHistory = new EventEmitter<void>();
  @Output() statClick = new EventEmitter<string>();

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
