import { Component, Input, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResearchService, Research, CameraReadyTask } from '../../../services/research.service';
import { MilestoneService } from '../../../services/milestone.service';
import { ConferenceService, Conference } from '../../../services/conference.service';
import { ConferenceModalComponent } from './conference-modal.component';
import { ChecklistService } from '../../../services/checklist.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-deadlines-tab',
  standalone: true,
  imports: [CommonModule, FormsModule, ConferenceModalComponent],
  animations: [
    trigger('doneAnim', [
      transition(':enter', [
        style({ transform: 'translateY(15px)', opacity: 0 }),
        animate('500ms cubic-bezier(0.16, 1, 0.3, 1)', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('confetti', [
      transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('600ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ]),
    trigger('slideDown', [
      transition(':enter', [
        style({ height: 0, opacity: 0, overflow: 'hidden' }),
        animate('400ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ height: '*', opacity: 1, overflow: 'hidden' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ height: 0, opacity: 0 }))
      ])
    ])
  ],
  template: `
    <div class="dashboard-wrapper">
      <header class="dashboard-header animate-fade-in">
        <div class="header-main">
          <h1 class="glow-text">Timeline</h1>
          <p class="subtitle">Global submission pipeline and milestone tracker</p>
        </div>
        <button class="prime-btn" (click)="createNewConference()">
          <span class="icon">✦</span> NEW CONFERENCE
        </button>
      </header>

      <div class="stats-row animate-slide-up">
        <button class="stat-pill interactive" 
                [class.active-filter]="currentFilter() === 'ACTIVE'" 
                (click)="setFilter('ACTIVE')">
          <span class="label">ACTIVE</span> 
          <span class="value">{{ activeConferencesCount() }}</span>
        </button>
        <button class="stat-pill interactive" 
                [class.active-filter]="currentFilter() === 'UPCOMING'" 
                (click)="setFilter('UPCOMING')">
          <span class="label">UPCOMING</span> 
          <span class="value">{{ upcomingConferencesCount() }}</span>
        </button>
      </div>

      <div class="conference-stack">
        @for (conf of filteredConferences(); track conf.id) {
          <div class="conf-card animate-slide-up" [style.--index]="$index">
            <div class="conf-hero">
              <div class="conf-meta">
                <span class="year-badge">{{ conf.year }}</span>
                <h2 class="conf-name">{{ conf.name || conf.shortName }}</h2>
              </div>
              <div class="conf-actions">
                @if (conf.portalLink) {
                  <a [href]="conf.portalLink" target="_blank" class="glass-link">
                    PORTAL <span class="arrow">↗</span>
                  </a>
                }
                <button class="manage-btn" (click)="editConference(conf)">MANAGE</button>
                <button class="card-delete-btn" (click)="deleteConference(conf.id!)">DELETE</button>
              </div>
            </div>

            <div class="timeline-container">
              <div class="timeline-track"></div>
              <div class="milestone-steps">
                <div [innerHTML]="renderMilestoneStep('SUBMISSION', conf.submissionDeadline)"></div>
                <div [innerHTML]="renderMilestoneStep('NOTIFICATION', conf.notificationDate)"></div>
                <div [innerHTML]="renderMilestoneStep('FINAL', conf.cameraReadyDeadline)"></div>
                <div [innerHTML]="renderMilestoneStep('REG', conf.registrationDeadline)"></div>
                <div [innerHTML]="renderMilestoneStep('EVENT', conf.conferenceDate)"></div>
              </div>
            </div>

            <div class="associated-papers-tray">
              <div class="tray-header interactive" (click)="togglePapers(conf.id!)">
                <div class="header-left">
                  <h3>PARTICIPATING PAPERS</h3>
                  <span class="count">{{ getPapersForConference(conf).length }}</span>
                </div>
                <div class="toggle-icon-wrap" [class.open]="expandedConferences[conf.id!]">
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" class="toggle-icon">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
              
              @if (expandedConferences[conf.id!]) {
                <div class="tray-body" @slideDown>
                  <div class="paper-checklist-stack">
                    @for (paper of getPapersForConference(conf); track paper.id) {
                      <div class="paper-row">
                        <div class="paper-header">
                          <div class="paper-info">
                            <span class="paper-id-tag">#{{ paper.pid }}</span>
                            <span class="paper-title-text">{{ paper.title }}</span>
                          </div>
                          <div style="display: flex; gap: 0.5rem; align-items: center;">
                            <button class="unlink-btn" (click)="unlinkPaper(paper, conf.id!)" title="Unlink paper from conference">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                            </button>
                            <span class="status-chip" [attr.data-status]="paper.status">{{ paper.status }}</span>
                          </div>
                        </div>

                        @if (isPaperChecklistComplete(paper)) {
                          <div class="congratulations-box" @doneAnim>
                            <div class="done-icon-wrapper" @confetti>🎉</div>
                            <div class="done-text">
                              <h5>CONGRATULATIONS AUTHOR!</h5>
                              <p>"Author have patience and submit currectly enjoy the conference."</p>
                            </div>
                            <div class="done-stamp">FINALISED</div>
                          </div>
                        } @else {
                          <div class="checklist-grid">
                            @for (task of paper.checklist; track task.taskKey) {
                              <div class="task-item">
                                <div class="task-label-row">
                                  <span class="task-label">{{ task.taskLabel }}</span>
                                  <div class="info-icon" [title]="getTaskHelp(task.taskKey)">
                                    <i>i</i>
                                  </div>
                                </div>
                                
                                <div class="slider-container" 
                                     [class.is-checked]="task.completed"
                                     (click)="onTaskClick(paper, task)">
                                  <div class="slider-fill"></div>
                                  <div class="swipe-slider-thumb">
                                    @if (task.completed) {
                                      <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                                      </svg>
                                    } @else {
                                      <div class="dot-icon"></div>
                                    }
                                  </div>
                                  <div class="slider-track">
                                    <span class="slider-placeholder">{{ task.completed ? 'COMPLETED' : 'CLICK TO COMPLETE' }}</span>
                                  </div>
                                </div>

                              </div>
                            }
                          </div>
                        }
                      </div>
                    } @empty {
                      <p class="empty-tray-text">No papers linked yet.</p>
                    }
                  </div>

                  <div class="dock-actions">
                    <select #pSelect class="modern-select">
                      <option value="">Link paper...</option>
                      @for (p of unlinkedPapers(); track p.id) {
                        <option [value]="p.id">{{ p.title }}</option>
                      }
                    </select>
                    <button class="join-btn" (click)="linkPaper(pSelect.value, conf.id)">LINK</button>
                  </div>
                </div>
              }
            </div>
            
            @if (isConferenceFinished(conf)) {
              <div class="lock-overlay">
                <div class="lock-content">
                  <span class="medal">🏁</span>
                  <span>COMPLETED</span>
                </div>
              </div>
            }
          </div>
        }
      </div>

      @if (selectedConferenceForEdit()) {
        <app-conference-modal
          [conference]="selectedConferenceForEdit()!"
          (save)="saveConference($event)"
          (cancel)="selectedConferenceForEdit.set(null)"
          (delete)="deleteConference($event)">
        </app-conference-modal>
      }
    </div>
  `,
  styles: [`
    :host { --accent: #6366f1; --accent-glow: rgba(99, 102, 241, 0.4); }
    .dashboard-wrapper { padding: 0 2rem 2rem 2rem; max-width: 1100px; margin: 0 auto; color: #1e293b; }

    /* HEADER */
    .dashboard-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; }
    .glow-text { font-size: 3.5rem; font-weight: 900; margin: 0; letter-spacing: -2px; background: linear-gradient(135deg, #1e293b 0%, #64748b 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .subtitle { margin: 0; color: #64748b; font-weight: 600; font-size: 0.9rem; }
    
    .prime-btn { 
      background: #1e293b; color: white; border: none; padding: 0.8rem 1.5rem; 
      border-radius: 12px; font-weight: 800; font-size: 0.75rem; cursor: pointer;
      display: flex; align-items: center; gap: 0.5rem; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
    }
    .prime-btn:hover { background: #0f172a; transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
    .prime-btn .icon { font-size: 1rem; color: #818cf8; }

    .stats-row { display: flex; gap: 1rem; margin-bottom: 3rem; }
    .stat-pill { 
      background: #f1f5f9; padding: 0.5rem 1.25rem; border-radius: 30px; font-size: 0.75rem; 
      font-weight: 800; border: 2px solid transparent; display: flex; gap: 0.75rem; 
      align-items: center; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }
    .stat-pill:hover { background: #e2e8f0; transform: translateY(-1px); }
    .stat-pill.active-filter { background: white; border-color: #3b82f6; box-shadow: 0 4px 12px rgba(59,130,246,0.15); transform: translateY(-2px); }
    .stat-pill .label { color: #64748b; transition: color 0.3s; }
    .stat-pill.active-filter .label { color: #2563eb; }
    .stat-pill .value { color: #1e293b; font-size: 0.85rem; }

    /* CONFERENCE CARDS */
    .conference-stack { display: flex; flex-direction: column; gap: 2.5rem; }
    .conf-card { 
      background: white; border-radius: 20px; border: 1px solid #e2e8f0;
      padding: 2rem; position: relative; transition: all 0.3s ease;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03);
    }
    .conf-card:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05); }

    .conf-hero { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2.5rem; }
    .conf-meta { display: flex; flex-direction: column; align-items: flex-start; gap: 0.5rem; }
    .year-badge { background: #eef2ff; color: #6366f1; padding: 4px 16px; border-radius: 100px; font-size: 0.75rem; font-weight: 800; }
    .conf-name { font-size: 1.8rem; font-weight: 900; margin: 0; color: #1e293b; letter-spacing: -0.5px; }

    .conf-actions { display: flex; gap: 0.75rem; }
    .glass-link, .manage-btn, .card-delete-btn {
      background: white; border: 1px solid #cbd5e1; padding: 0.5rem 1.25rem;
      border-radius: 100px; font-weight: 800; font-size: 0.7rem; cursor: pointer; transition: all 0.2s;
      display: flex; align-items: center; justify-content: center; text-decoration: none; color: #475569;
    }
    .glass-link:hover, .manage-btn:hover { background: #f8fafc; color: #1e293b; border-color: #94a3b8; }
    
    .card-delete-btn { background: #fff1f2; color: #e11d48; border-color: #fecdd3; }
    .card-delete-btn:hover { background: #ffe4e6; border-color: #fca5a5; color: #be123c; }

    /* TIMELINE */
    .timeline-container { position: relative; margin-bottom: 3rem; padding: 0 1rem; }
    .timeline-track { position: absolute; height: 2px; background: #e2e8f0; left: 3rem; right: 3rem; top: 48px; border-radius: 2px; z-index: 0; }
    .milestone-steps { position: relative; display: flex; justify-content: space-between; align-items: center; z-index: 1; }
    
    ::ng-deep .ms-step { display: flex; flex-direction: column; align-items: center; gap: 6px; flex: 1; position: relative; }
    
    ::ng-deep .ms-label { font-size: 0.65rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
    ::ng-deep .ms-value { font-size: 0.85rem; font-weight: 800; color: #334155; margin-bottom: 8px; }
    
    ::ng-deep .ms-dot { 
      width: 14px; height: 14px; border-radius: 50%; background: white; 
      border: 3px solid #cbd5e1;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    ::ng-deep .ms-step.passed .ms-dot { border-color: #6366f1; background: #6366f1; box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1); }
    ::ng-deep .ms-step.active .ms-dot { border-color: #3b82f6; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2); animation: pulse 2s infinite; }
    ::ng-deep .ms-step.missing .ms-dot { border-style: dashed; border-color: #cbd5e1; background: #f8fafc; }
    
    ::ng-deep .ms-sub { font-size: 0.6rem; color: #94a3b8; font-weight: 700; text-transform: uppercase; margin-top: 6px; }

    @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); } 100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); } }

    /* PAPERS TRAY */
    .associated-papers-tray { background: #f8fafc; border-radius: 16px; border: 1px solid #f1f5f9; overflow: hidden; margin-top: 1rem; }
    .tray-header { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; }
    .tray-header.interactive { cursor: pointer; transition: background 0.2s; user-select: none; }
    .tray-header.interactive:hover { background: #f1f5f9; }
    .header-left { display: flex; align-items: center; gap: 0.75rem; }
    .tray-header h3 { font-size: 0.8rem; font-weight: 800; color: #64748b; margin: 0; letter-spacing: 0.5px; }
    .tray-header .count { background: #e2e8f0; color: #475569; padding: 2px 10px; border-radius: 100px; font-size: 0.7rem; font-weight: 900; }
    
    .toggle-icon-wrap { display: flex; align-items: center; color: #64748b; transition: color 0.3s; }
    .tray-header:hover .toggle-icon-wrap { color: #3b82f6; }
    .toggle-text { font-size: 0.65rem; font-weight: 800; letter-spacing: 0.5px; opacity: 0; transform: translateX(10px); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
    .tray-header:hover .toggle-text { opacity: 1; transform: translateX(0); }
    .toggle-icon { transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
    .toggle-icon-wrap.open .toggle-icon { transform: rotate(180deg); color: #2563eb; }
    
    .tray-body { padding: 0 1.25rem 1.25rem 1.25rem; }

    .paper-checklist-stack { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem; }
    .paper-row { background: white; border-radius: 16px; padding: 1.25rem; border: 1px solid #e2e8f0; position: relative; width: 100%; box-sizing: border-box; }

    .paper-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; border-bottom: 1px solid #f1f5f9; padding-bottom: 0.75rem; }
    .paper-info { display: flex; align-items: center; gap: 0.5rem; flex: 1; }
    .paper-id-tag { background: #1e293b; color: white; font-size: 0.55rem; font-weight: 900; padding: 2px 6px; border-radius: 4px; }
    .paper-title-text { font-size: 0.85rem; font-weight: 800; color: #1e293b; line-height: 1.3; }
    .status-chip { font-size: 0.6rem; font-weight: 900; padding: 4px 10px; border-radius: 6px; background: #e2e8f0; text-transform: uppercase; }
    .status-chip[data-status="ACCEPTED"] { background: #dcfce7; color: #166534; }
    
    .unlink-btn { background: #fff1f2; color: #e11d48; border: 1px solid #fecdd3; border-radius: 6px; padding: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
    .unlink-btn:hover { background: #ffe4e6; color: #be123c; border-color: #fca5a5; }

    .checklist-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
    .task-item { display: flex; flex-direction: column; gap: 0.5rem; }

    .task-label-row { display: flex; justify-content: space-between; align-items: center; }
    .task-label { font-size: 0.65rem; font-weight: 700; color: #475569; letter-spacing: 0.3px; line-height: 1.2; }
    .info-icon { 
      width: 14px; height: 14px; border-radius: 50%; background: #f1f5f9; 
      color: #64748b; font-size: 9px; display: flex; align-items: center; 
      justify-content: center; font-style: normal; cursor: help; flex-shrink: 0;
    }

    /* CLICK-TO-COMPLETE UI */
    .slider-container { 
      position: relative; height: 32px; background: #f8fafc; border-radius: 100px; 
      display: flex; align-items: center; padding: 0 4px; border: 1px solid #e2e8f0; 
      transition: background 0.4s ease, border-color 0.4s ease, box-shadow 0.2s ease;
      cursor: pointer; overflow: hidden;
      user-select: none; -webkit-user-select: none;
    }
    .slider-container:hover { box-shadow: 0 2px 6px rgba(0,0,0,0.05); border-color: #cbd5e1; }
    .slider-container.is-checked { background: #ecfdf5; border-color: #a7f3d0; }
    .slider-container.is-checked:hover { background: #d1fae5; border-color: #6ee7b7; }
    .slider-container:active { transform: scale(0.98); }

    .slider-fill {
      position: absolute; left: 0; top: 0; bottom: 0; width: 0%;
      background: linear-gradient(90deg, #a7f3d0 0%, #34d399 100%);
      border-radius: 100px; opacity: 0;
      transition: width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease;
      z-index: 0;
    }
    .slider-container.is-checked .slider-fill { width: 100%; opacity: 1; }

    .slider-track { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 1; pointer-events: none; }
    .slider-placeholder { font-size: 0.6rem; font-weight: 800; color: #64748b; letter-spacing: 0.5px; transition: color 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
    .slider-container.is-checked .slider-placeholder { color: #064e3b; transform: scale(1.05); }

    .swipe-slider-thumb {
      width: 24px; height: 24px; border-radius: 50%;
      background: white; border: 1.5px solid #cbd5e1; box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      position: absolute; left: 4px; z-index: 2;
      display: flex; align-items: center; justify-content: center;
      transition: left 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
    }
    .slider-container.is-checked .swipe-slider-thumb {
      left: calc(100% - 28px); /* 100% view minus thumb width (24px) minus padding (4px) */
      background: #10b981; border-color: #059669; box-shadow: 0 4px 12px rgba(16,185,129,0.4);
    }

    .check-icon { width: 16px; height: 16px; opacity: 0; transform: scale(0.5) rotate(-45deg); transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); color: white; }
    .slider-container.is-checked .check-icon { opacity: 1; transform: scale(1) rotate(0); }
    
    .dot-icon { width: 6px; height: 6px; border-radius: 50%; background: #94a3b8; transition: opacity 0.3s ease; }
    .slider-container.is-checked .dot-icon { opacity: 0; }



    /* CONGRATULATIONS BOX */
    .congratulations-box { 
      background: #f0fdf4; border: 2px solid #bbf7d0; border-radius: 12px; 
      padding: 1rem; display: flex; gap: 1rem; align-items: center;
      box-shadow: 0 10px 15px -3px rgba(34, 197, 94, 0.1);
    }
    .done-icon-wrapper { font-size: 1.8rem; }
    .done-text h5 { margin: 0; font-size: 0.75rem; font-weight: 900; color: #166534; letter-spacing: 0.5px; }
    .done-text p { margin: 4px 0 0 0; font-size: 0.65rem; color: #15803d; font-weight: 600; font-style: italic; line-height: 1.4; }
    .done-stamp { 
      margin-left: auto; border: 2px solid #166534; color: #166534; 
      font-size: 0.55rem; font-weight: 900; padding: 2px 6px; border-radius: 4px; 
      transform: rotate(-5deg); opacity: 0.6;
    }
    .empty-tray-text { color: #94a3b8; font-size: 0.75rem; font-weight: 600; margin-bottom: 1rem; }

    .dock-actions { display: flex; gap: 0.5rem; border-top: 1px solid #e2e8f0; padding-top: 0.75rem; width: 100%; box-sizing: border-box; }
    .modern-select { background: white; border: 1px solid #e2e8f0; padding: 0.4rem 0.6rem; border-radius: 8px; font-size: 0.7rem; font-weight: 600; outline: none; flex: 1; min-width: 0; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; box-sizing: border-box; }
    .join-btn { background: #e2e8f0; border: none; padding: 0.4rem 1rem; border-radius: 8px; font-weight: 800; font-size: 0.65rem; cursor: pointer; }
    .join-btn:hover { background: #cbd5e1; }

    /* OVERLAYS */
    .lock-overlay { 
      position: absolute; inset: 0; background: rgba(255,255,255,0.7); 
      backdrop-filter: blur(4px); z-index: 5; border-radius: 32px;
      display: flex; align-items: center; justify-content: center;
    }
    .lock-content { background: white; padding: 1.5rem 2.5rem; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 2px solid #e2e8f0; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; font-weight: 900; font-size: 0.8rem; color: #64748b; }
    .medal { font-size: 2rem; }

    /* ANIMATIONS */
    .animate-fade-in { animation: fIn 0.6s ease-out backwards; }
    .animate-slide-up { animation: sUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) backwards; animation-delay: calc(var(--index, 0) * 0.1s); }
    @keyframes fIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes sUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class DeadlinesTabComponent implements OnInit {
  private researchService = inject(ResearchService);
  private conferenceService = inject(ConferenceService);
  private checklistService = inject(ChecklistService);

  allPapers = this.researchService.researchItems;
  activeConferences = this.conferenceService.conferences;
  selectedConferenceForEdit = signal<Conference | null>(null);

  // Filtering state
  currentFilter = signal<'ACTIVE' | 'UPCOMING'>('ACTIVE');

  // Track which conference cards have their paper tray expanded
  expandedConferences: Record<number, boolean> = {};

  unlinkedPapers = computed(() => this.allPapers().filter(p => !p.conference));

  // Filtered lists
  filteredConferences = computed(() => {
    const list = this.activeConferences();
    const now = new Date();
    // Normalize to date only for robust comparison
    now.setHours(0, 0, 0, 0);

    if (this.currentFilter() === 'ACTIVE') {
      return list.filter(c => {
        if (!c.submissionDeadline) return false; // Or true depending on if no-date means active. Let's assume no-date goes to UPCOMING or just stays ACTIVE. But user says "upcoming dates are in future.. active is date already done".
        const subDate = new Date(c.submissionDeadline);
        subDate.setHours(0, 0, 0, 0);
        return subDate <= now; // Submission deadline has passed or is today (done)
      });
    } else {
      return list.filter(c => {
        if (!c.submissionDeadline) return true; // Treat no-date as upcoming
        const subDate = new Date(c.submissionDeadline);
        subDate.setHours(0, 0, 0, 0);
        return subDate > now; // Upcoming dates are in the future
      });
    }
  });

  activeConferencesCount = computed(() => {
    const list = this.activeConferences();
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return list.filter(c => {
      if (!c.submissionDeadline) return false;
      const subDate = new Date(c.submissionDeadline);
      subDate.setHours(0, 0, 0, 0);
      return subDate <= now;
    }).length;
  });

  upcomingConferencesCount = computed(() => {
    const list = this.activeConferences();
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return list.filter(c => {
      if (!c.submissionDeadline) return true;
      const subDate = new Date(c.submissionDeadline);
      subDate.setHours(0, 0, 0, 0);
      return subDate > now;
    }).length;
  });

  ngOnInit() { this.conferenceService.loadAll(); }

  setFilter(filterMode: 'ACTIVE' | 'UPCOMING') {
    this.currentFilter.set(filterMode);
  }

  getPapersForConference(conf: Conference): Research[] {
    if (!conf) return [];
    const confId = conf.id;
    const shortName = conf.shortName?.toLowerCase().trim();
    const confName = conf.name?.toLowerCase().trim();

    return this.allPapers().filter(p => {
      // 1. Direct ID match (Best)
      if (p.conference?.id === confId) return true;

      // 2. Fallback to matching Publication Name or Venue with Conference ShortName or Name
      if (p.publication && (shortName || confName)) {
        const pubName = (p.publication.name || '').toLowerCase().trim();
        const pubVenue = (p.publication.venue || '').toLowerCase().trim();
        const pubPublisher = (p.publication.publisher || '').toLowerCase().trim();

        // Exact match checking
        if (shortName && (pubName === shortName || pubVenue === shortName || pubPublisher === shortName)) return true;
        if (confName && (pubName === confName || pubVenue === confName || pubPublisher === confName)) return true;

        // Looser include mapping checking, restricted to whole words, and ONLY applied 
        // to the full Conference Name. Short acronyms (like "QPAIN") cause too many 
        // false positives when matched loosely against venues or publisher text.
        const createWordRegex = (term: string) => {
          const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          return new RegExp(`\\b${escapedTerm}\\b`, 'i');
        };

        if (confName && confName.length > 5) {
          const confNameRegex = createWordRegex(confName);
          if (confNameRegex.test(pubName) || confNameRegex.test(pubVenue) || confNameRegex.test(pubPublisher)) return true;
        }
      }

      return false;
    });
  }

  renderMilestoneStep(label: string, date: string | undefined): string {
    const isMissing = !date;
    let isPassed = false;
    let isActive = false;
    let dateStr = 'TBD';

    if (date) {
      const diff = Date.parse(date) - Date.now();
      isPassed = diff <= 0;
      isActive = !isPassed && diff < 7 * 24 * 60 * 60 * 1000;
      dateStr = new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }

    const classes = `ms-step ${isMissing ? 'missing' : ''} ${isPassed ? 'passed' : ''} ${isActive ? 'active' : ''}`;

    return `
      <div class="${classes}">
        <span class="ms-label">${label}</span>
        <span class="ms-value">${isMissing ? '---' : dateStr}</span>
        <div class="ms-dot"></div>
        <span class="ms-sub">${isPassed ? 'DONE' : isMissing ? 'PENDING' : 'OPEN'}</span>
      </div>
    `;
  }

  isConferenceFinished(conf: Conference): boolean {
    return !!conf.conferenceDate && Date.parse(conf.conferenceDate) < Date.now();
  }

  createNewConference() {
    this.selectedConferenceForEdit.set({ name: '', shortName: '', year: new Date().getFullYear() });
  }

  editConference(conf: Conference) {
    this.selectedConferenceForEdit.set(conf);
  }

  saveConference(conf: Conference) {
    const obs = conf.id ? this.conferenceService.update(conf.id, conf) : this.conferenceService.create(conf);
    obs.subscribe(() => {
      this.selectedConferenceForEdit.set(null);
      this.conferenceService.loadAll();
    });
  }

  deleteConference(id: number) {
    if (confirm('Delete this conference?')) {
      this.conferenceService.delete(id).subscribe(() => {
        this.selectedConferenceForEdit.set(null);
        this.researchService.refresh();
      });
    }
  }

  linkPaper(paperIdStr: string, confId: number | undefined) {
    if (!paperIdStr || !confId) return;
    const p = this.allPapers().find(x => x.id === parseInt(paperIdStr));
    if (p) {
      if (!p.conference) p.conference = { id: confId } as Conference;
      else p.conference.id = confId;

      this.researchService.save(p).subscribe(() => this.researchService.refresh());
    }
  }

  unlinkPaper(paper: Research, confId: number) {
    if (confirm(`Remove "${paper.title}" from this conference?`)) {
      // 1. Break the strict DB link
      paper.conference = undefined;

      // 2. Break the fuzzy text link
      // If the paper was being matched purely by text (e.g. publication name/venue),
      // we must clear those fields so it doesn't immediately remap on refresh.
      if (paper.publication) {
        const c = this.conferenceService.conferences().find(x => x.id === confId);
        if (c) {
          const sName = c.shortName?.toLowerCase().trim() || '';
          const lName = c.name?.toLowerCase().trim() || '';
          const pName = (paper.publication.name || '').toLowerCase();
          const pVenue = (paper.publication.venue || '').toLowerCase();
          const pPub = (paper.publication.publisher || '').toLowerCase();

          if (sName && (pName === sName || pVenue === sName || pPub === sName)) {
            paper.publication.name = ''; paper.publication.venue = ''; paper.publication.publisher = '';
          } else if (lName && (pName === lName || pVenue === lName || pPub === lName)) {
            paper.publication.name = ''; paper.publication.venue = ''; paper.publication.publisher = '';
          }
        }
      }

      this.researchService.save(paper).subscribe(() => {
        this.researchService.refresh();
      });
    }
  }

  isPaperChecklistComplete(paper: Research): boolean {
    if (!paper.checklist || paper.checklist.length === 0) return false;
    return paper.checklist.every(t => t.completed);
  }

  togglePapers(confId: number) {
    this.expandedConferences[confId] = !this.expandedConferences[confId];
  }

  getTaskHelp(key: string): string {
    const help: Record<string, string> = {
      'CAMERA_READY': 'Final camera-ready version of your paper with publisher formatting.',
      'COPYRIGHT': 'The copyright transfer document required for publication.',
      'VALIDATION': 'Verification that the paper meets all technical and formatting standards (e.g., PDF eXpress).',
      'PAYMENT': 'Registration fee payment confirmation.',
      'RESPONSE': 'Detailed response to reviewers and metadata updates.',
      'OTHER_DOCS': 'Additional verification documents such as student ID or IEEE membership card.'
    };
    return help[key] || 'Follow the instructions provided by the conference portal.';
  }

  onTaskClick(paper: Research, task: CameraReadyTask) {
    if (task.completed) {
      this.toggleTask(paper, task, false);
    } else {
      if (this.isLastTask(paper, task)) {
        // Apply slight delay for visual effect of clicking before showing confirm box
        setTimeout(() => {
          if (confirm('are u sure the tasks asign are finished?')) {
            this.toggleTask(paper, task, true);
          }
        }, 50);
      } else {
        this.toggleTask(paper, task, true);
      }
    }
  }

  private isLastTask(paper: Research, task: CameraReadyTask): boolean {
    if (!paper.checklist) return false;
    const pending = paper.checklist.filter(t => !t.completed);
    return pending.length === 1 && pending[0].taskKey === task.taskKey;
  }

  private toggleTask(paper: Research, task: CameraReadyTask, completed: boolean) {
    // Optimistic UI update handled purely by CSS class binding now
    task.completed = completed;

    if (paper.id) {
      this.checklistService.toggleTask(paper.id, task.taskKey, completed).subscribe({
        next: (updated) => {
          task.completed = updated.completed;
        },
        error: () => {
          // Revert on failure
          task.completed = !completed;
        }
      });
    }
  }
}
