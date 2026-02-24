import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Conference } from '../../../services/conference.service';
import { Research, CameraReadyTask } from '../../../services/research.service';
import { ChecklistService } from '../../../services/checklist.service';
import { trigger, transition, style, animate, state } from '@angular/animations';

@Component({
  selector: 'app-conference-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  host: { 'style': 'display: contents;' },
  animations: [
    trigger('doneAnim', [
      transition(':enter', [
        style({ transform: 'scale(0.8) translateY(10px)', opacity: 0 }),
        animate('400ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({ transform: 'scale(1) translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('confetti', [
      transition(':enter', [
        style({ transform: 'scale(0.5)', opacity: 0 }),
        animate('500ms ease-out', style({ transform: 'scale(1.2)', opacity: 1 })),
        animate('300ms ease-in', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ])
  ],
  template: `
    <div class="glass-modal">
      <div class="modal-content" [class.wide-modal]="true">
        <h3 class="modal-title">{{ localConf.id ? 'UPDATE' : 'NEW' }} CONFERENCE</h3>
        
        <div class="modal-body-scroll">
          <div class="grid-form">
            <!-- Row 1 -->
            <div class="field span-2">
              <label>SHORT NAME / ACRONYM</label>
              <input [(ngModel)]="localConf.shortName" placeholder="e.g. NeurIPS" class="glass-input">
            </div>
            <div class="field">
              <label>YEAR</label>
              <input [(ngModel)]="localConf.year" type="number" class="glass-input">
            </div>

            <!-- Row 2 -->
            <div class="field span-3">
              <label>PUBLISHER</label>
              <input [(ngModel)]="localConf.publisher" placeholder="e.g. IEEE, ACM, Springer" class="glass-input">
            </div>

            <!-- Row 3 -->
            <div class="field span-2">
              <label>PLATFORM LINK</label>
              <input [(ngModel)]="localConf.platformLink" 
                     (ngModelChange)="onPlatformLinkChange($event)"
                     placeholder="e.g. https://easychair.org/..." class="glass-input">
            </div>
            <div class="field">
              <label>PLATFORM</label>
              <input [value]="localConf.platformName || 'None'" disabled class="glass-input disabled">
            </div>
            
            <!-- Row 4 -->
            <div class="field span-3">
              <label>PORTAL / SUBMISSION LINK</label>
              <input [(ngModel)]="localConf.portalLink" placeholder="https://..." class="glass-input">
            </div>
            
            <!-- Deadlines -->
            <div class="field span-3 deadline-header">
               <span class="deadline-title">TIMELINE & MILESTONES</span>
            </div>
            
            <div class="field span-3">
              <label>SMART PASTE (Paste dates directly from conference website)</label>
              <textarea class="glass-input smart-paste-area" 
                        [(ngModel)]="smartPasteText" 
                        (input)="handleSmartPaste()"
                        placeholder="e.g. Submission Deadline: October 15, 2026&#10;Notification of Acceptance: December 1, 2026&#10;Camera Ready: January 10, 2027"></textarea>
            </div>

            <div class="field">
              <label>SUBMISSION</label>
              <input type="text" placeholder="DD/MM/YYYY"
                     [ngModel]="formatDateForDisplay(localConf.submissionDeadline)"
                     (ngModelChange)="localConf.submissionDeadline = parseDateFromDisplay($event)"
                     class="glass-input">
            </div>
            <div class="field">
              <label>NOTIFICATION</label>
              <input type="text" placeholder="DD/MM/YYYY"
                     [ngModel]="formatDateForDisplay(localConf.notificationDate)"
                     (ngModelChange)="localConf.notificationDate = parseDateFromDisplay($event)"
                     class="glass-input">
            </div>
            <div class="field">
              <label>CAMERA-READY</label>
              <input type="text" placeholder="DD/MM/YYYY"
                     [ngModel]="formatDateForDisplay(localConf.cameraReadyDeadline)"
                     (ngModelChange)="localConf.cameraReadyDeadline = parseDateFromDisplay($event)"
                     class="glass-input">
            </div>
            
            <div class="field">
              <label>REGISTRATION</label>
              <input type="text" placeholder="DD/MM/YYYY"
                     [ngModel]="formatDateForDisplay(localConf.registrationDeadline)"
                     (ngModelChange)="localConf.registrationDeadline = parseDateFromDisplay($event)"
                     class="glass-input">
            </div>
            <div class="field span-2">
              <label>START DATE</label>
              <input type="text" placeholder="DD/MM/YYYY"
                     [ngModel]="formatDateForDisplay(localConf.conferenceDate)"
                     (ngModelChange)="localConf.conferenceDate = parseDateFromDisplay($event)"
                     class="glass-input">
            </div>
          </div>

          @if (localConf.papers && localConf.papers.length > 0) {
            <div class="papers-section">
              <h4 class="section-title">PARTICIPATING PAPERS</h4>
              
              <div class="paper-checklist-stack">
                @for (paper of localConf.papers; track paper.id) {
                  <div class="paper-row">
                    <div class="paper-header">
                      <div class="paper-info">
                        <span class="paper-id-tag">#{{ paper.pid }}</span>
                        <span class="paper-title">{{ paper.title }}</span>
                      </div>
                      <span class="paper-status" [class]="paper.status.toLowerCase()">{{ paper.status }}</span>
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
                            
                            <div class="slider-container">
                              <input type="range" min="0" max="100" 
                                     [value]="task.completed ? 100 : 0" 
                                     (input)="onSliderInput($event, paper, task)"
                                     class="swipe-slider"
                                     [class.checked]="task.completed">
                              <div class="slider-track">
                                <span class="slider-placeholder">{{ task.completed ? 'DONE' : 'SWIPE TO DONE' }}</span>
                              </div>
                            </div>
                          </div>
                        }
                      </div>
                    }
                  </div>
                }
              </div>
            </div>
          }
        </div>

        <div class="modal-footer">
          @if (localConf.id) {
            <button class="delete-btn" (click)="onDelete()">DELETE</button>
          }
          <div style="flex: 1;"></div>
          <button class="cancel-btn" (click)="onCancel()">CANCEL</button>
          <button class="save-btn" (click)="onSave()">SAVE</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .glass-modal {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.45); backdrop-filter: blur(4px);
      z-index: 10000; display: flex; align-items: center; justify-content: center;
      padding: 20px; box-sizing: border-box;
    }
    
    .modal-content {
      background: #ffffff; width: 100%; max-width: 850px; 
      border-radius: 24px; padding: 2.5rem; 
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      border: 1px solid #e2e8f0; 
      display: flex; flex-direction: column;
      position: relative; overflow: hidden;
      max-height: 95vh;
    }

    .modal-body-scroll {
      overflow-y: auto; padding-right: 10px; flex: 1;
      scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent;
    }

    .modal-title {
      font-size: 1.1rem; font-weight: 900; color: #1e293b;
      text-align: center; margin-bottom: 2rem; letter-spacing: 1px;
      text-transform: uppercase;
    }

    .grid-form {
      display: grid; grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1.25rem; margin-bottom: 2rem;
    }

    .span-2 { grid-column: span 2; }
    .span-3 { grid-column: span 3; }

    .field label { font-size: 0.6rem; font-weight: 800; color: #64748b; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; }

    .glass-input {
      width: 100%; box-sizing: border-box; background: #f8fafc; border: 1.5px solid #e2e8f0;
      padding: 0.75rem 1rem; border-radius: 12px; outline: none; font-size: 0.9rem; color: #334155;
      transition: all 0.2s;
    }
    .glass-input:focus { border-color: #6366f1; background: white; box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1); }
    .glass-input.disabled { background: #f1f5f9; color: #94a3b8; cursor: not-allowed; }

    /* SMART PASTE */
    .deadline-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px dashed #f1f5f9; padding-bottom: 0.5rem; margin-top: 1rem; }
    .deadline-title { font-size: 0.75rem; font-weight: 900; color: #64748b; letter-spacing: 1px; }
    .smart-paste-area { min-height: 80px; resize: vertical; font-size: 0.8rem; line-height: 1.4; color: #475569; }

    /* PAPERS SECTION */
    .papers-section { margin-top: 2rem; border-top: 1px solid #f1f5f9; padding-top: 2rem; }
    .section-title { font-size: 0.75rem; font-weight: 900; color: #94a3b8; letter-spacing: 1px; margin-bottom: 1.5rem; }

    .paper-checklist-stack { display: flex; flex-direction: column; gap: 2rem; }
    .paper-row { background: #f8fafc; border-radius: 20px; padding: 1.5rem; border: 1px solid #f1f5f9; position: relative; }

    .paper-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.75rem; }
    .paper-info { display: flex; align-items: center; gap: 0.75rem; flex: 1; }
    .paper-id-tag { background: #1e293b; color: white; font-size: 0.65rem; font-weight: 900; padding: 2px 6px; border-radius: 4px; }
    .paper-title { font-size: 0.95rem; font-weight: 800; color: #1e293b; line-height: 1.3; }
    .paper-status { font-size: 0.6rem; font-weight: 900; padding: 4px 10px; border-radius: 6px; background: #e2e8f0; }
    .paper-status.accepted { background: #dcfce7; color: #166534; }

    .checklist-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
    .task-item { display: flex; flex-direction: column; gap: 0.75rem; }

    .task-label-row { display: flex; justify-content: space-between; align-items: center; }
    .task-label { font-size: 0.7rem; font-weight: 700; color: #475569; }
    .info-icon { 
      width: 14px; height: 14px; border-radius: 50%; background: #e2e8f0; 
      color: #64748b; font-size: 9px; display: flex; align-items: center; 
      justify-content: center; font-style: normal; cursor: help;
    }

    /* SLIDER UI */
    .slider-container { position: relative; height: 32px; background: #f1f5f9; border-radius: 100px; display: flex; align-items: center; padding: 0 4px; border: 1px solid #e2e8f0; }
    .slider-track { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 1; pointer-events: none; }
    .slider-placeholder { font-size: 0.6rem; font-weight: 900; color: #94a3b8; letter-spacing: 0.5px; }

    .swipe-slider {
      -webkit-appearance: none; width: 100%; height: 100%; background: transparent; 
      outline: none; z-index: 2; position: relative; cursor: pointer; margin: 0;
    }
    .swipe-slider::-webkit-slider-thumb {
      -webkit-appearance: none; width: 40px; height: 24px; border-radius: 12px;
      background: white; border: 1.5px solid #cbd5e1; box-shadow: 0 2px 4px rgba(0,0,0,0.05); filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
      transition: 0.2s;
    }
    .swipe-slider.checked::-webkit-slider-thumb { background: #10b981; border-color: #059669; }

    /* CONGRATULATIONS BOX */
    .congratulations-box { 
      background: #f0fdf4; border: 2px solid #bbf7d0; border-radius: 16px; 
      padding: 1.5rem; display: flex; gap: 1.25rem; align-items: center;
      box-shadow: 0 10px 15px -3px rgba(34, 197, 94, 0.1);
    }
    .done-icon-wrapper { font-size: 2.25rem; }
    .done-text h5 { margin: 0; font-size: 0.8rem; font-weight: 900; color: #166534; letter-spacing: 0.5px; }
    .done-text p { margin: 4px 0 0 0; font-size: 0.75rem; color: #15803d; font-weight: 600; font-style: italic; line-height: 1.4; }
    .done-stamp { 
      margin-left: auto; border: 2px solid #166534; color: #166534; 
      font-size: 0.6rem; font-weight: 900; padding: 4px 8px; border-radius: 4px; 
      transform: rotate(-5deg); opacity: 0.6;
    }

    .modal-footer { margin-top: 2rem; display: flex; gap: 1rem; }
    .save-btn { background: #1e293b; color: white; border: none; padding: 0.85rem 1.75rem; border-radius: 14px; font-weight: 800; cursor: pointer; font-size: 0.85rem; box-shadow: 0 4px 0 #000; transform: translateY(-4px); transition: 0.2s; }
    .save-btn:active { transform: translateY(0); box-shadow: none; }
    .cancel-btn { background: white; color: #64748b; border: 1.5px solid #e2e8f0; padding: 0.85rem 1.5rem; border-radius: 14px; font-weight: 800; cursor: pointer; }
    .delete-btn { background: #fff1f2; color: #e11d48; border: none; padding: 0.85rem 1rem; border-radius: 14px; font-weight: 800; cursor: pointer; }
  `]
})
export class ConferenceModalComponent {
  private checklistService = inject(ChecklistService);

  @Input() set conference(conf: Conference) {
    this.localConf = { ...conf };
  }
  @Output() save = new EventEmitter<Conference>();
  @Output() cancel = new EventEmitter<void>();
  @Output() delete = new EventEmitter<number>();

  localConf: Conference = { name: '', shortName: '', year: new Date().getFullYear(), publisher: '', platformLink: '', platformName: '' };
  smartPasteText = '';

  onPlatformLinkChange(link: string) {
    if (!link) {
      this.localConf.platformName = '';
      return;
    }
    const lowerLink = link.toLowerCase();
    if (lowerLink.includes('easychair.org')) this.localConf.platformName = 'EasyChair';
    else if (lowerLink.includes('edas.info')) this.localConf.platformName = 'EDAS';
    else if (lowerLink.includes('cmt3.research.microsoft.com') || lowerLink.includes('cmt.research')) this.localConf.platformName = 'CMT';
    else if (lowerLink.includes('openreview.net')) this.localConf.platformName = 'OpenReview';
    else if (lowerLink.includes('hotcrp.com')) this.localConf.platformName = 'HotCRP';
    else if (lowerLink.includes('softconf.com')) this.localConf.platformName = 'START / Softconf';
    else if (lowerLink.includes('morressier.com')) this.localConf.platformName = 'Morressier';
    else if (lowerLink.includes('linklings.net')) this.localConf.platformName = 'Linklings';
    else if (lowerLink.includes('epapers.org')) this.localConf.platformName = 'ePapers';
    else if (lowerLink.includes('conftool.com') || lowerLink.includes('conftool.net')) this.localConf.platformName = 'ConfTool';
    else this.localConf.platformName = 'Other';
  }

  // Converts backend YYYY-MM-DD to display DD/MM/YYYY
  formatDateForDisplay(isoString?: string): string {
    if (!isoString) return '';
    const parts = isoString.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`; // DD/MM/YYYY
    }
    return isoString;
  }

  // Converts user input DD/MM/YYYY (or DD-MM-YYYY) back to backend YYYY-MM-DD
  parseDateFromDisplay(displayString: string): string | undefined {
    if (!displayString) return undefined;

    // Replace separators with slashes for uniform parsing
    const cleanStr = displayString.replace(/[-.]/g, '/');
    const parts = cleanStr.split('/');

    // Check if it's strictly DD/MM/YYYY
    if (parts.length === 3) {
      const dd = parts[0].padStart(2, '0');
      const mm = parts[1].padStart(2, '0');
      const yyyy = parts[2];

      // Basic validation ensuring year is sensible
      if (yyyy.length === 4 && !isNaN(Number(dd)) && !isNaN(Number(mm)) && !isNaN(Number(yyyy))) {
        return `${yyyy}-${mm}-${dd}`;
      }
    }

    // Fallback: If not properly formatted yet, just store raw string temporarily.
    // Backend requires YYYY-MM-DD, so invalid formats might fail validation on save.
    return displayString;
  }

  handleSmartPaste() {
    if (!this.smartPasteText) return;

    // 1. Broad regex to find anything that looks like a date:
    // Matches: "MAR 07, 2026", "April 15, 2026", "2026-05-10", "15/04/2026", "JUNE 17-18, 2026"
    // Since ranges like "JUNE 17-18" exist, we'll try to just grab the 'JUNE 17' part to make it a valid JS date.
    const dateRegex = /(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)\s+\d{1,2}(?:st|nd|rd|th)?(?:-\d{1,2})?\s*,?\s*\d{4}|\d{4}-\d{2}-\d{2}|\d{1,2}[/-]\d{1,2}[/-]\d{2,4}/gi;

    const matches = this.smartPasteText.match(dateRegex);
    if (!matches) return;

    // 2. Parse and format the matches
    const parsedDates: string[] = [];

    for (let match of matches) {
      // Clean up common range issues before parsing: "JUNE 17-18, 2026" -> "JUNE 17, 2026"
      match = match.replace(/(\d{1,2})-(\d{1,2})/, '$1');
      match = match.replace(/(st|nd|rd|th)/ig, ''); // Strip ordinals

      const parsed = new Date(match);
      if (!isNaN(parsed.getTime())) {
        const yyyy = parsed.getFullYear();
        const mm = String(parsed.getMonth() + 1).padStart(2, '0');
        const dd = String(parsed.getDate()).padStart(2, '0');
        parsedDates.push(`${yyyy}-${mm}-${dd}`);
      }
    }

    // 3. Assign them sequentially based on standard conference flows
    if (parsedDates.length > 0) this.localConf.submissionDeadline = parsedDates[0];
    if (parsedDates.length > 1) this.localConf.notificationDate = parsedDates[1];
    if (parsedDates.length > 2) this.localConf.cameraReadyDeadline = parsedDates[2];
    if (parsedDates.length > 3) this.localConf.registrationDeadline = parsedDates[3];
    if (parsedDates.length > 4) this.localConf.conferenceDate = parsedDates[4];
  }

  isPaperChecklistComplete(paper: Research): boolean {
    if (!paper.checklist || paper.checklist.length === 0) return false;
    return paper.checklist.every(t => t.completed);
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

  onSliderInput(event: any, paper: Research, task: CameraReadyTask) {
    const val = parseInt(event.target.value);

    // Check if we reached the end
    if (val >= 95) {
      if (!task.completed) {
        if (this.isLastTask(paper, task)) {
          if (confirm('are u sure the tasks asign are finished?')) {
            this.toggleTask(paper, task, true);
          } else {
            event.target.value = 0;
          }
        } else {
          this.toggleTask(paper, task, true);
        }
      }
    } else if (val <= 5) {
      // Reset allows untoggling if needed, but user didn't ask for it specifically.
      // However, making it un-swipable once checked is also a valid premium choice.
    }
  }

  private isLastTask(paper: Research, task: CameraReadyTask): boolean {
    if (!paper.checklist) return false;
    const pending = paper.checklist.filter(t => !t.completed);
    return pending.length === 1 && pending[0].taskKey === task.taskKey;
  }

  private toggleTask(paper: Research, task: CameraReadyTask, completed: boolean) {
    if (paper.id) {
      this.checklistService.toggleTask(paper.id, task.taskKey, completed).subscribe(updated => {
        task.completed = updated.completed;
      });
    }
  }

  onSave() { this.save.emit(this.localConf); }
  onCancel() { this.cancel.emit(); }
  onDelete() { if (this.localConf.id) this.delete.emit(this.localConf.id); }
}
