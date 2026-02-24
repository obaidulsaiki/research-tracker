import { Component, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SystemSettings, SettingsService } from '../../../services/settings.service';
import { ResearchService } from '../../../services/research.service';
import { ConferenceService, Conference } from '../../../services/conference.service';

@Component({
  selector: 'app-overview-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="overview-container animate-reveal">
      <!-- STATS VISUALIZATION -->
      <div class="stat-grid">
         @for (stat of mainStats(); track stat.label) {
           <div class="p-card stat-item interactive" (click)="onStatClick(stat.label)">
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
              <p class="chart-subtitle">Precision tracking against your academic goals</p>
            </div>
            
            @if (settings()) {
              <div class="goal-setter">
                <span class="goal-label">Daily Goal:</span>
                <select [ngModel]="settings()?.dailyResearchGoal" (ngModelChange)="updateGoal(settings(), $event)" class="goal-select">
                  @for (g of [4, 6, 8, 10, 12]; track g) {
                    <option [ngValue]="g">{{ g }}h</option>
                  }
                </select>
              </div>
            }

            <button class="btn-glass audit-btn" (click)="viewAllHistory()">Full Audit Log</button>
          </div>
          
          <!-- ANALYTICS VISUALIZER -->
          @if (settings()) {
            <div class="visualizer">
                @for (h of activityData(); track $index) {
                  <div class="bar-container">
                    <div class="bar" 
                         [style.height.%]="(Math.max(h || 0, 0.5) / 12) * 100"
                         [class.goal-met]="h >= settings()!.dailyResearchGoal">
                      <div class="bar-value">{{ h > 0 ? h.toFixed(1) : h }}h</div>
                      @if (h >= settings()!.dailyResearchGoal) {
                        <div class="success-star">✨</div>
                      }
                    </div>
                  </div>
                } @empty {
                   <div class="empty-chart">
                      <p>No activity recorded in the last 7 days</p>
                   </div>
                }
                <!-- DYNAMIC BASELINE -->
                <div class="baseline" [style.bottom.%]="(settings()!.dailyResearchGoal / 12) * 100">
                  <span class="baseline-tag">{{ settings()!.dailyResearchGoal }}h TARGET</span>
                </div>
            </div>
          } @else {
            <div class="visualizer loading-viz">
                <p>Initializing analysis engine...</p>
            </div>
          }
          
          <div class="chart-legend">
             <div class="legend-item">
                <div class="legend-dot accent"></div>
                <span>Research Time</span>
             </div>
             <div class="legend-item">
                <div class="legend-dot goal-dot"></div>
                <span>Goal Met</span>
             </div>
             <div class="legend-item">
                <div class="legend-dot target-dot"></div>
                <span>Target Focus</span>
             </div>
          </div>
        </div>

        <!-- MILESTONE HIGHLIGHTS WIDGET -->
        <div class="p-card deadline-card">
          <div class="deadline-header">
            <div>
              <h3 class="deadline-title">Milestone Radar</h3>
              <p class="deadline-subtitle">Mission-critical submission windows</p>
            </div>
            <div class="deadline-count">{{ upcomingMilestones().length }} Active</div>
          </div>

          <div class="deadline-list">
            @for (ms of upcomingMilestones().slice(0, 3); track ms.title) {
              <div class="deadline-item" [class.priority-urgent]="ms.isUrgent">
                <div class="deadline-info">
                  <div class="deadline-name">{{ ms.venue }}</div>
                  <div class="deadline-meta">
                    <span class="p-badge">{{ ms.type }}</span>
                    <span class="deadline-notes">{{ ms.title | slice:0:30 }}...</span>
                  </div>
                </div>
                <div class="countdown-clock">
                  <div class="clock-value">{{ ms.daysLeft }}</div>
                  <div class="clock-label">DAYS</div>
                </div>
              </div>
            } @empty {
              <div class="empty-deadline">
                <div class="empty-icon">🏖️</div>
                <p>No immediate milestones. Keep exploring!</p>
              </div>
            }
          </div>
          
          <button class="btn-glass full-width" style="margin-top: auto;" (click)="exploreDeadlines()">Manage All Milestones</button>
        </div>

        <!-- RECENT ACTIVITY FEED -->
        <div class="p-card activity-card">
          <h3 class="activity-title">Recent Stream</h3>
          
          <div class="activity-feed">
            @for (item of recentHistory(); track item.id) {
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
                <p class="status-desc">Metadata synchronization and auto-backup engine are active.</p>
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

    .view-split { display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 1.5rem; }
    
    .chart-card { min-height: 400px; padding: 1.5rem; position: relative; margin-bottom: 2rem; }
    .chart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; gap: 1rem; }
    .chart-titles { flex: 1; }
    .chart-title { font-family: var(--font-display); font-size: 1.25rem; font-weight: 800; letter-spacing: -0.3px; }
    .chart-subtitle { font-size: 0.75rem; color: var(--p-text-muted); font-weight: 500; }
    
    .goal-setter { 
      display: flex; align-items: center; gap: 0.5rem; background: var(--p-bg-subtle);
      padding: 0.4rem 0.8rem; border-radius: 10px; border: 1px solid var(--p-border);
    }
    .goal-label { font-size: 0.65rem; font-weight: 800; color: var(--p-text-muted); text-transform: uppercase; }
    .goal-select {
      background: transparent; border: none; font-weight: 900; font-size: 0.8rem; color: var(--p-accent); cursor: pointer;
    }

    .audit-btn { padding: 0.5rem 1rem; font-size: 0.75rem; height: 36px; }

    .visualizer { 
      padding: 1.5rem; background: var(--p-bg-subtle); border-radius: 12px; 
      height: 240px; position: relative; overflow: hidden; display: flex; 
      align-items: flex-end; gap: 0.75rem; border: 1px solid var(--p-border);
    }
    .bar-container { flex: 1; height: 100%; display: flex; align-items: flex-end; }
    .bar { 
      width: 100%; border-radius: 6px 6px 0 0; position: relative; 
      background: var(--p-text-muted); opacity: 0.4; transition: all 0.6s cubic-bezier(0.19, 1, 0.22, 1);
    }
    .bar.goal-met { 
      background: linear-gradient(to top, #10b981, #34d399); opacity: 1; 
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
    }
    .bar-value { position: absolute; top: -20px; left: 50%; transform: translateX(-50%); font-size: 0.55rem; font-weight: 800; color: var(--p-text-muted); }
    .bar.goal-met .bar-value { color: #059669; }
    
    .success-star {
      position: absolute; top: -35px; left: 50%; transform: translateX(-50%);
      font-size: 0.8rem; animation: float 2s infinite ease-in-out;
    }
    @keyframes float {
      0%, 100% { transform: translate(-50%, 0); }
      50% { transform: translate(-50%, -5px); }
    }

    .baseline { 
      position: absolute; left: 0; right: 0; height: 0; 
      border-top: 2px dashed #f59e0b; z-index: 10;
      transition: all 0.5s ease;
    }
    .baseline-tag {
      position: absolute; right: 0px; top: -14px;
      background: #fef3c7; color: #92400e; padding: 2px 6px;
      font-size: 0.5rem; font-weight: 900; border-radius: 4px; border: 1px solid #fde68a;
    }

    .chart-legend { margin-top: 1.5rem; display: flex; gap: 1.5rem; }
    .legend-item { display: flex; align-items: center; gap: 0.4rem; font-size: 0.7rem; font-weight: 700; color: var(--p-text-muted); }
    .legend-dot { width: 10px; height: 10px; border-radius: 3px; }
    .legend-dot.accent { background: var(--p-text-muted); opacity: 0.4; }
    .legend-dot.goal-dot { background: #10b981; }
    .legend-dot.target-dot { border: 1.5px dashed #f59e0b; }

    .activity-card { padding: 1.5rem; background: white; border: 1px solid var(--p-border); }
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
    .empty-chart { display: flex; height: 100%; width: 100%; align-items: center; justify-content: center; color: var(--p-text-muted); font-weight: 800; font-size: 0.7rem; }
    .loading-viz { display: flex; align-items: center; justify-content: center; color: var(--p-text-muted); font-size: 0.8rem; font-weight: 600; }

    .status-banner { 
      background: var(--p-gradient); color: white; display: flex; 
      align-items: center; justify-content: space-between; padding: 1.25rem 2rem; 
      border-radius: 16px; border: none;
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

    /* DEADLINE RADAR STYLES */
    .deadline-card { padding: 1.5rem; display: flex; flex-direction: column; background: white; border: 1px solid var(--p-border); }
    .deadline-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
    .deadline-title { font-family: var(--font-display); font-size: 1.15rem; font-weight: 800; }
    .deadline-subtitle { font-size: 0.75rem; color: var(--p-text-muted); font-weight: 500; }
    .deadline-count { background: var(--p-bg-alt); color: var(--p-text); padding: 4px 10px; border-radius: 8px; font-size: 0.65rem; font-weight: 800; }
    
    .deadline-list { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem; }
    .deadline-item { 
      padding: 1rem; background: var(--p-bg-subtle); border-radius: 12px; border: 1px solid var(--p-border);
      display: flex; justify-content: space-between; align-items: center; transition: all 0.3s ease;
    }
    .deadline-item:hover { transform: translateX(5px); border-color: var(--p-accent); }
    .deadline-name { font-weight: 800; font-size: 0.9rem; color: var(--p-text); margin-bottom: 0.25rem; }
    .deadline-meta { display: flex; align-items: center; gap: 0.5rem; }
    
    .countdown-clock { text-align: center; background: white; padding: 0.5rem; border-radius: 10px; min-width: 60px; border: 1px solid var(--p-border); }
    .clock-value { font-size: 1.25rem; font-weight: 900; color: var(--p-accent); font-family: var(--font-display); line-height: 1; }
    .clock-label { font-size: 0.5rem; font-weight: 800; color: var(--p-text-muted); margin-top: 2px; }
    
    .p-badge { padding: 2px 6px; border-radius: 4px; font-size: 0.55rem; font-weight: 800; background: var(--p-bg-alt); color: var(--p-text); }
    
    .deadline-item.priority-urgent { border-left: 4px solid #ef4444; background: #fffbff; }
    .deadline-item.priority-urgent .clock-value { color: #ef4444; }

    .full-width { width: 100%; font-size: 0.75rem; padding: 0.75rem; }
    .empty-deadline { text-align: center; padding: 2rem; opacity: 0.5; }
  `]
})
export class OverviewTabComponent implements OnInit {

  private router = inject(Router);
  private researchService = inject(ResearchService);
  private settingsService = inject(SettingsService);
  private conferenceService = inject(ConferenceService);
  protected readonly Math = Math;

  // Derive State Localized
  researchItems = this.researchService.researchItems;
  history = this.researchService.history;
  settings = computed(() => this.settingsService.settings() || {
    dailyResearchGoal: 8,
    autoBackupEnabled: false,
    backupIntervalHours: 24
  });

  mainStats = computed(() => {
    const items = this.researchItems();
    return [
      { label: 'Total Papers', value: items.length },
      { label: 'Published', value: items.filter(i => i.status === 'PUBLISHED').length },
      { label: 'Accepted', value: items.filter(i => i.status === 'ACCEPTED').length },
      { label: 'Running', value: items.filter(i => i.status === 'RUNNING').length },
      { label: 'Hypothesis', value: items.filter(i => i.status === 'HYPOTHESIS').length },
      { label: 'Working', value: items.filter(i => i.status === 'WORKING').length }
    ];
  });

  recentHistory = computed(() => {
    return this.history().slice(0, 5);
  });

  activityData = computed(() => {
    const entries = this.history();
    const last7Days = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);

      const count = entries.filter(e => {
        if (!e.timestamp) return false;
        const entryDate = new Date(e.timestamp);
        return entryDate.getFullYear() === d.getFullYear() &&
          entryDate.getMonth() === d.getMonth() &&
          entryDate.getDate() === d.getDate();
      }).length;
      last7Days.push(Math.min(count * 2.5, 12));
    }
    return last7Days;
  });

  upcomingMilestones = computed(() => {
    const conferences = this.conferenceService.conferences();
    const allMilestones: any[] = [];
    conferences.forEach(c => {
      this.addIfValid(allMilestones, 'Initial Submission', c.shortName || 'Conf', 'Submission', c.submissionDeadline);
      this.addIfValid(allMilestones, 'Notification', c.shortName || 'Conf', 'Notification', c.notificationDate);
      this.addIfValid(allMilestones, 'Camera-Ready Phase', c.shortName || 'Conf', 'Camera-Ready', c.cameraReadyDeadline);
      this.addIfValid(allMilestones, 'Early Registration', c.shortName || 'Conf', 'Registration', c.registrationDeadline);
      this.addIfValid(allMilestones, 'Event Start', c.shortName || 'Conf', 'Conference', c.conferenceDate);
    });
    return allMilestones
      .filter(ms => ms.daysLeft >= 0)
      .sort((a, b) => a.daysLeft - b.daysLeft);
  });

  ngOnInit() {
    if (this.conferenceService.conferences().length === 0) {
      this.conferenceService.loadAll();
    }
  }

  viewAllHistory() {
    this.router.navigate(['/history']);
  }

  exploreDeadlines() {
    this.router.navigate(['/deadlines']);
  }

  onStatClick(label: string) {
    const l = label.toLowerCase();
    let status = 'ALL';
    if (l.includes('published')) status = 'PUBLISHED';
    else if (l.includes('accepted')) status = 'ACCEPTED';
    else if (l.includes('running')) status = 'RUNNING';
    else if (l.includes('hypothesis')) status = 'HYPOTHESIS';
    else if (l.includes('working')) status = 'WORKING';

    this.router.navigate(['/research-list', status]);
  }

  private addIfValid(list: any[], title: string, venue: string, type: string, date: string | undefined) {
    if (!date) return;
    const diff = Date.parse(date) - Date.now();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days >= 0) {
      list.push({
        title, venue, type, daysLeft: days, isUrgent: days < 7
      });
    }
  }

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

  updateGoal(s: SystemSettings | null | undefined, goal: number) {
    if (!s) return;
    const updated = { ...s, dailyResearchGoal: goal };
    this.settingsService.updateSettings(updated).subscribe();
  }
}
