import { Component, inject, signal, Output, EventEmitter, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResearchService, Research, Author } from '../../services/research.service';

@Component({
  selector: 'app-add-paper-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop" (click)="close.emit()">
      <div class="data-card modal-container animate-fade-in" (click)="$event.stopPropagation()">
        <header class="modal-header">
          <h2>{{ paper.id ? 'Edit' : 'New' }} Research Record</h2>
          <button class="btn-close" (click)="close.emit()">×</button>
        </header>

        <div class="modal-tabs">
          <button [class.active]="tab() === 'basic'" (click)="tab.set('basic')">General</button>
          <button [class.active]="tab() === 'pub'" (click)="tab.set('pub')">Publication</button>
          <button [class.active]="tab() === 'authors'" (click)="tab.set('authors')">Authors</button>
          <button [class.active]="tab() === 'links'" (click)="tab.set('links')">Links</button>
          <button [class.active]="tab() === 'dates'" (click)="tab.set('dates')">Details</button>
        </div>

        <form (submit)="onSubmit($event)" class="modal-body">
          <div *ngIf="errorMessage()" class="validation-banner">
             <span>⚠️</span> {{ errorMessage() }}
          </div>
          <div *ngIf="successMessage()" class="success-banner">
             <span>✅</span> {{ successMessage() }}
          </div>

          <div *ngIf="tab() === 'basic'" class="tab-pane">
            <div class="field-row">
              <div class="field-group full">
                <label>Paper Title <span class="required-star">*</span></label>
                <input type="text" [(ngModel)]="paper.title" (ngModelChange)="onMainDetailsChange()" name="title" required class="input-field" [class.field-error]="!paper.title && showValidation()" placeholder="Entry title...">
                <div *ngIf="!paper.title && showValidation()" class="error-text">Title is mandatory</div>
              </div>
            </div>
            <div class="field-row triple">
              <div class="field-group">
                <label>PID</label>
                <input type="number" [(ngModel)]="paper.pid" name="pid" class="input-field" placeholder="PID" [disabled]="isPidDisabled()">
              </div>
              <div class="field-group">
                <label>Status</label>
                <select [(ngModel)]="paper.status" name="status" class="input-field">
                  <option value="WORKING">Working</option>
                  <option value="RUNNING">Running</option>
                  <option value="HYPOTHESIS">Hypothesis</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
              <div class="field-group">
                <label>Publication Type</label>
                <select [(ngModel)]="paper.publication!.type" (ngModelChange)="onTypeChange($event)" name="pubType" class="input-field">
                  <option value="JOURNAL">JOURNAL</option>
                  <option value="CONFERENCE">CONFERENCE</option>
                  <option value="ARTICLE">ARTICLE</option>
                  <option value="REVIEW">REVIEW</option>
                  <option value="BOOK_CHAPTER">BOOK_CHAPTER</option>
                  <option value="PREPRINT">PREPRINT</option>
                  <option value="POSTER">POSTER</option>
                  <option value="THESIS">THESIS</option>
                  <option value="HYPOTHESIS">HYPOTHESIS</option>
                  <option [value]="paper.publication!.type" *ngIf="paper.publication!.type && !['JOURNAL','CONFERENCE','ARTICLE','REVIEW','BOOK_CHAPTER','PREPRINT','POSTER','THESIS','HYPOTHESIS'].includes(paper.publication!.type)">
                    {{ paper.publication!.type }} (Unrecognized)
                  </option>
                </select>
              </div>
            </div>
            <div class="field-group">
                <label>Author Place (e.g., 1 for First Author)</label>
                <input type="number" [(ngModel)]="paper.authorPlace" name="authorPlace" class="input-field" placeholder="Position (1, 2...)">
            </div>
          </div>

          <div *ngIf="tab() === 'pub'" class="tab-pane">
            <div class="field-group">
              <label>Publication Name (Journal/Conference)</label>
              <div style="display: flex; gap: 0.5rem; align-items: center;">
                <input type="text" [(ngModel)]="paper.publication!.name" (ngModelChange)="onJournalNameChange($event); onMainDetailsChange()" name="pubName" class="input-field" placeholder="e.g. Nature, ICC, EuroS&P...">
                <button type="button" class="btn-glass" (click)="onJournalNameChange(paper.publication!.name)" style="padding: 0.75rem; width: 50px;" title="Lookup Journal Info">🔍</button>
              </div>
              <small *ngIf="lookupStatus()" 
                [style.color]="lookupStatus().includes('✨') || lookupStatus().includes('🤖') ? '#10b981' : '#64748b'"
                style="display: block; margin-top: 0.25rem; font-weight: 700; font-size: 0.75rem; animation: fade-in 0.3s ease;">
                {{ lookupStatus() }}
              </small>
            </div>
            <div class="field-group">
              <label>Publisher Name</label>
              <input type="text" [(ngModel)]="paper.publication!.publisher" name="pubPublisher" class="input-field" placeholder="e.g. IEEE, Springer...">
            </div>
            <div class="field-row triple">
              <div class="field-group">
                <label>Year</label>
                <input type="text" [(ngModel)]="paper.publication!.year" (ngModelChange)="onMainDetailsChange()" name="pubYear" class="input-field" placeholder="202X">
              </div>
              <div class="field-group">
                <label>Impact Factor</label>
                <input type="number" step="0.001" [(ngModel)]="paper.publication!.impactFactor" name="pubImpact" class="input-field" placeholder="0.000" [disabled]="isMetricDisabled()">
              </div>
              <div class="field-group">
                <label>Journal Quartile</label>
                <select [(ngModel)]="paper.publication!.quartile" name="pubQuartile" class="input-field" [disabled]="isMetricDisabled()">
                  <option value="N/A">N/A</option>
                  <option value="Q1">Q1</option>
                  <option value="Q2">Q2</option>
                  <option value="Q3">Q3</option>
                  <option value="Q4">Q4</option>
                  <option value="NON-PREDATORY">NON-PREDATORY</option>
                  <option value="NON INDEXED">NON INDEXED</option>
                </select>
              </div>
            </div>
            <div class="field-group">
              <label>Venue (City, Country or Virtual)</label>
              <input type="text" [(ngModel)]="paper.publication!.venue" name="pubVenue" class="input-field" placeholder="Location if applicable">
            </div>
            <div class="field-group">
              <label>Direct Publication Link</label>
              <input type="url" [(ngModel)]="paper.publication!.url" name="pubUrl" class="input-field" placeholder="https://doi.org/...">
            </div>
          </div>

          <div *ngIf="tab() === 'authors'" class="tab-pane authors-pane">
            <div class="field-group">
              <label>Bulk Author Import (Comma separated)</label>
              <textarea [value]="getBulkAuthors()" (input)="onBulkAuthorChange($event)" class="input-field" placeholder="Example: Obaidul Haque, Mariha Tabassum" rows="1"></textarea>
            </div>
            <div class="author-stack">
              <div class="author-item" *ngFor="let author of paper.authors; let i = index">
                <div class="author-idx">{{ i + 1 }}</div>
                <input type="text" [(ngModel)]="author.name" [name]="'a-name-'+i" class="input-field" placeholder="Author Name">
                <input type="number" [(ngModel)]="author.contributionPercentage" [name]="'a-pct-'+i" class="input-field" style="width: 80px" placeholder="Place">
                <button type="button" class="btn-del" (click)="removeAuthor(i)">🗑</button>
              </div>
            </div>
            <button type="button" class="btn-add-ghost" (click)="addAuthor()">+ Add Contributor</button>
          </div>

          <div *ngIf="tab() === 'links'" class="tab-pane">
            <div class="field-row">
              <div class="field-group">
                <label>Overleaf URL</label>
                <input type="url" [(ngModel)]="paper.overleafUrl" name="overleaf" class="input-field" placeholder="Project URL">
              </div>
              <div class="field-group">
                <label>Online URL</label>
                <input type="url" [(ngModel)]="paper.paperUrl" name="paperLink" class="input-field" placeholder="DOI / Web URL">
              </div>
            </div>
            <div class="field-row">
              <div class="field-group">
                <label>Drive Link</label>
                <input type="url" [(ngModel)]="paper.driveUrl" name="drive" class="input-field" placeholder="Google Drive Link">
              </div>
              <div class="field-group">
                <label>Dataset</label>
                <input type="url" [(ngModel)]="paper.datasetUrl" name="dataset" class="input-field" placeholder="GitHub / Repo Link">
              </div>
            </div>
          </div>

          <div *ngIf="tab() === 'dates'" class="tab-pane">
             <div class="field-row">
                <div class="field-group">
                  <label>Submission Date</label>
                  <input type="date" [(ngModel)]="paper.submissionDate" name="sub" class="input-field">
                </div>
                <div class="field-group">
                  <label>Decision Date</label>
                  <input type="date" [(ngModel)]="paper.decisionDate" name="dec" class="input-field">
                </div>
             </div>
             <div class="field-group">
                <label>Research Abstract (Public Snippet)</label>
                <textarea [(ngModel)]="paper.synopsis" name="abstract" class="input-field" rows="6" placeholder="Brief summary for your public portfolio..."></textarea>
             </div>
             <div class="field-group">
                <label>Technical Notes (Private)</label>
                <textarea [(ngModel)]="paper.notes" name="notes" class="input-field" rows="4" placeholder="Private internal observations..."></textarea>
             </div>
          </div>

          <footer class="modal-actions">
            <div class="action-opts">
              <label class="check-opt">
                <input type="checkbox" [ngModel]="paper.publicVisibility === 'PUBLIC'" (ngModelChange)="paper.publicVisibility = $event ? 'PUBLIC' : 'PRIVATE'" name="visibility"> Show in Public Profile
              </label>
              <label class="check-opt">
                <input type="checkbox" [(ngModel)]="paper.featured" name="featured"> Feature in Archive
              </label>
            </div>
            <div class="spacer"></div>
            <button type="button" class="btn-cancel" (click)="close.emit()">Cancel</button>
            <button type="submit" class="btn-primary">Save Changes</button>
          </footer>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop { 
      position: fixed; inset: 0; background: hsla(222, 47%, 8%, 0.4); 
      backdrop-filter: var(--p-glass); 
      display: flex; align-items: center; justify-content: center; 
      z-index: 3000; padding: 2rem; 
      animation: backdrop-in 0.4s ease;
    }
    @keyframes backdrop-in { from { opacity: 0; } to { opacity: 1; } }

    .modal-container { 
      width: 100%; max-width: 680px; display: flex; flex-direction: column; overflow: hidden; 
      background: var(--p-surface); border-radius: 24px; border: 1px solid var(--p-border);
      box-shadow: var(--p-shadow-premium);
    }
    .modal-header { 
      padding: 1.5rem 2.5rem; display: flex; justify-content: space-between; align-items: center; 
      background: var(--p-surface); border-bottom: 1px solid var(--p-bg-subtle);
    }
    .modal-header h2 { font-family: var(--font-display); font-size: 1.25rem; font-weight: 800; color: var(--p-text); letter-spacing: -0.03em; }
    .btn-close { 
      background: var(--p-bg-subtle); border: 1px solid var(--p-border); 
      width: 32px; height: 32px; border-radius: 10px; display: grid; place-items: center;
      cursor: pointer; color: var(--p-text-muted); transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .btn-close:hover { background: white; border-color: var(--p-error); color: var(--p-error); transform: rotate(90deg); }

    .validation-banner {
      background: var(--p-error-bg); border: 1px solid rgba(239, 68, 68, 0.2);
      backdrop-filter: blur(8px); padding: 0.75rem 1.25rem; border-radius: 12px;
      margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.75rem;
      color: #b91c1c; font-size: 0.875rem; font-weight: 600;
      animation: slide-down 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .success-banner {
      background: var(--p-success-bg); border: 1px solid rgba(16, 185, 129, 0.2);
      backdrop-filter: blur(8px); padding: 0.75rem 1.25rem; border-radius: 12px;
      margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.75rem;
      color: #065f46; font-size: 0.875rem; font-weight: 600;
      animation: slide-down 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    @keyframes slide-down {
      from { transform: translateY(-10px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    .field-error { border-color: var(--p-error) !important; }
    .error-text { color: var(--p-error); font-size: 0.75rem; font-weight: 700; margin-top: 0.25rem; }
    .required-star { color: var(--p-error); margin-left: 2px; }
    
    .btn-glass {
      background: var(--p-bg-subtle); border: 1px solid var(--p-border);
      border-radius: 10px; cursor: pointer; transition: all 0.2s;
      display: grid; place-items: center; font-size: 1.1rem;
    }
    .btn-glass:hover { background: white; border-color: var(--p-accent); transform: scale(1.05); }

    .modal-tabs { 
      display: flex; gap: 0.25rem; background: var(--p-surface-muted); 
      padding: 0.4rem; margin: 0 2.5rem; margin-top: 1.5rem; 
      border-radius: 14px; border: 1px solid var(--p-bg-subtle);
    }
    .modal-tabs button { 
      flex: 1; padding: 0.625rem; border: none; background: transparent; 
      font-size: 0.8125rem; font-weight: 700; color: var(--p-text-muted); 
      cursor: pointer; border-radius: 10px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .modal-tabs button.active { 
      background: white; color: var(--p-accent); 
      box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.08), inset 0 0 0 1px hsla(210, 100%, 50%, 0.1); 
    }
    .modal-tabs button:hover:not(.active) { color: var(--p-text); background: var(--p-bg-subtle); }

    .modal-body { padding: 1.5rem 2.25rem; }
    .tab-pane { display: flex; flex-direction: column; gap: 1.25rem; min-height: 300px; }
    
    .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
    .field-row.triple { grid-template-columns: 1fr 1fr 1fr; }
    .field-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .field-group label { 
      font-size: 0.625rem; font-weight: 800; color: var(--p-text-muted); 
      text-transform: uppercase; letter-spacing: 0.08em; 
    }
    .field-group.full { grid-column: span 2; }
    
    .input-field {
      width: 100%; padding: 0.75rem 1rem; background: var(--p-bg); 
      border: 1px solid var(--p-border); border-radius: var(--p-radius-sm);
      font-family: inherit; font-size: 0.875rem; color: var(--p-text); 
      transition: all 0.15s ease;
    }
    .input-field:focus { 
      background: white; border-color: var(--p-accent); 
      box-shadow: 0 0 0 4px var(--p-accent-glow); 
    }

    .author-stack { display: flex; flex-direction: column; gap: 0.5rem; max-height: 240px; overflow-y: auto; padding-right: 0.4rem; }
    .author-item { 
      display: flex; gap: 0.75rem; align-items: center; 
      padding: 0.5rem 0.75rem; background: var(--bg-main); border-radius: 12px;
      border: 1px solid var(--border-dim); transition: all 0.2s;
    }
    .author-item:hover { border-color: var(--border-glass); background: white; }
    .author-idx { 
      font-size: 0.6875rem; font-weight: 800; background: var(--p-gradient); 
      color: white; width: 24px; height: 24px; border-radius: 7px; 
      display: grid; place-items: center; flex-shrink: 0;
    }
    .btn-del { 
      background: hsla(0, 84%, 60%, 0.05); border: none; 
      cursor: pointer; color: #ef4444; width: 28px; height: 28px; border-radius: 8px;
      display: grid; place-items: center; transition: all 0.2s;
    }
    .btn-del:hover { background: #ef4444; color: white; transform: scale(1.05); }
    
    .btn-add-ghost { 
      background: transparent; border: 2px dashed var(--border-glass); 
      color: var(--text-dim); width: 100%; padding: 0.75rem; border-radius: 12px;
      font-weight: 700; font-size: 0.8125rem; cursor: pointer; transition: all 0.2s;
    }
    .btn-add-ghost:hover { border-color: var(--accent-primary); color: var(--accent-primary); background: hsla(210, 100%, 50%, 0.02); }

    .modal-actions { 
      padding: 1.5rem 2.25rem; display: flex; align-items: center; gap: 2rem; 
      background: white; border-top: 1px solid var(--border-dim);
    }
    .action-opts { display: flex; flex-direction: column; gap: 0.5rem; }
    .check-opt { 
      font-size: 0.8125rem; font-weight: 700; display: flex; align-items: center; gap: 0.75rem; 
      cursor: pointer; color: var(--text-dim); transition: color 0.2s;
    }
    .check-opt:hover { color: var(--text-main); }
    .check-opt input { accent-color: var(--accent-primary); width: 18px; height: 18px; cursor: pointer; }
    
    .btn-cancel { 
      background: transparent; border: none; font-weight: 700; color: var(--text-muted); 
      cursor: pointer; padding: 0.75rem 1.5rem; transition: color 0.2s; 
    }
    .btn-cancel:hover { color: var(--text-main); }

    .btn-primary { 
      background: var(--p-accent); color: white; border: none; 
      padding: 0.8rem 2.5rem; border-radius: 14px; font-weight: 800; 
      cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 8px 20px -4px var(--p-accent-glow);
    }
    .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 12px 28px -4px var(--p-accent-glow); }
  `]
})
export class AddPaperModalComponent implements OnInit, OnChanges {
  public researchService: ResearchService = inject(ResearchService);
  @Output() close = new EventEmitter<void>();

  tab = signal('basic');
  paper: Research = this.getEmptyPaper();
  errorMessage = signal('');
  successMessage = signal('');
  showValidation = signal(false);
  isCheckingDuplicate = signal(false);

  @Input() set editData(data: Research | undefined) {
    if (data && Object.keys(data).length > 0) {
      this.paper = JSON.parse(JSON.stringify(data));
      if (!this.paper.authors) {
        this.paper.authors = [];
      } else {
        // Ensure authors have sequential order if missing or zero
        this.paper.authors.forEach((a: Author, idx: number) => {
          if (!a.contributionPercentage || a.contributionPercentage === 0) {
            a.contributionPercentage = idx + 1;
          }
        });
      }

      if (!this.paper.publication) {
        this.paper.publication = this.getEmptyPaper().publication;
      } else {
        // Normalize type using keyword mapping
        this.paper.publication.type = this.mapPaperType(this.paper.publication.type);
        if (!this.paper.publication.quartile) this.paper.publication.quartile = 'N/A';
      }
    } else {
      this.paper = this.getEmptyPaper();
    }
  }

  private mapPaperType(val: any): string {
    const v = String(val || '').toUpperCase().trim();
    if (v === 'CONFERENCE' || v === 'CONFERENCE PROCEEDING') return 'CONFERENCE';
    if (v === 'JOURNAL' || v === 'JOURNAL PUBLICATION') return 'JOURNAL';
    if (v === 'ARTICLE' || v === 'GENERAL ARTICLE') return 'ARTICLE';

    if (v.includes('CONFERENCE')) return 'CONFERENCE';
    if (v.includes('JOURNAL')) return 'JOURNAL';
    if (v.includes('ARTICLE')) return 'ARTICLE';
    if (v.includes('REVIEW')) return 'REVIEW';
    if (v.includes('BOOK')) return 'BOOK_CHAPTER';
    if (v.includes('PREPRINT')) return 'PREPRINT';
    if (v.includes('POSTER')) return 'POSTER';
    if (v.includes('THESIS') || v.includes('DISSERTATION')) return 'THESIS';
    if (v.includes('HYPOTHESIS')) return 'HYPOTHESIS';

    const valid = ['JOURNAL', 'CONFERENCE', 'ARTICLE', 'REVIEW', 'BOOK_CHAPTER', 'PREPRINT', 'POSTER', 'THESIS', 'HYPOTHESIS'];
    return valid.includes(v) ? v : 'ARTICLE';
  }

  getEmptyPaper(): Research {
    return {
      title: '', status: 'WORKING', pid: 0, authorPlace: 1, authors: [],
      publication: {
        type: 'JOURNAL',
        name: '',
        publisher: '',
        year: '',
        venue: '',
        impactFactor: '',
        quartile: 'N/A',
        url: ''
      },
      publicVisibility: 'PRIVATE',
      overleafUrl: '', paperUrl: '', driveUrl: '', datasetUrl: '',
      tags: [], featured: false, synopsis: '', notes: ''
    };
  }

  ngOnInit() {
    console.log('MODAL[ngOnInit] current paper state:', this.paper);
    if (!this.paper.id && this.paper.authors.length === 0) {
      console.log('MODAL[ngOnInit] Adding initial author for new record');
      this.addAuthor();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // Logic handled by editData setter to stay unified
  }

  isPidDisabled() {
    return ['JOURNAL', 'REVIEW', 'BOOK_CHAPTER', 'PREPRINT', 'POSTER', 'THESIS', 'HYPOTHESIS'].includes(this.paper.publication!.type);
  }

  isMetricDisabled() {
    return this.paper.publication!.type === 'CONFERENCE';
  }

  onTypeChange(newType: string) {
    if (newType === 'CONFERENCE') {
      this.paper.publication!.impactFactor = '0.0';
      this.paper.publication!.quartile = 'N/A';
    }
    this.onMainDetailsChange();
  }

  private duplicateSub: any;
  onMainDetailsChange() {
    this.errorMessage.set('');
    if (!this.paper.title || this.paper.title.length < 5) return;

    if (this.duplicateSub) this.duplicateSub.unsubscribe();

    this.isCheckingDuplicate.set(true);
    this.duplicateSub = this.researchService.checkDuplicate(this.paper).subscribe({
      next: (res) => {
        if (res.exists) {
          this.errorMessage.set('⚠️ A research record with this Title, Publication, and Year already exists.');
        }
        this.isCheckingDuplicate.set(false);
      },
      error: () => this.isCheckingDuplicate.set(false)
    });
  }

  lookupStatus = signal('');
  onJournalNameChange(name: string) {
    if (!name || name.length < 3) {
      this.lookupStatus.set('');
      return;
    }

    this.lookupStatus.set('Searching OpenAlex AI...');
    console.log('AUTO-FILL: Looking up journal:', name);
    this.researchService.lookupJournal(name).subscribe({
      next: (meta) => {
        if (meta) {
          console.log('AUTO-FILL: Found metadata:', meta);
          const prefix = meta.impactFactor !== '0.0' ? '✨ Smart Fill' : '🤖 AI Match';
          this.lookupStatus.set(`${prefix}: Applied info for ${meta.name}`);

          this.paper.publication!.quartile = meta.quartile || 'N/A';
          this.paper.publication!.impactFactor = meta.impactFactor || '0.0';
          this.paper.publication!.publisher = meta.publisher || '';
          this.paper.publication!.url = meta.url || '';

          if (meta.quartile && meta.quartile !== 'CONFERENCE') {
            this.paper.publication!.type = 'JOURNAL';
          } else if (meta.quartile === 'CONFERENCE') {
            this.paper.publication!.type = 'CONFERENCE';
          }
        } else {
          this.lookupStatus.set('No match found.');
        }
      },
      error: (err) => {
        console.warn('AUTO-FILL: Error or not found:', name, err);
        this.lookupStatus.set('⚠️ Lookup failed (check backend)');
      }
    });
  }

  onBulkAuthorChange(event: any) {
    const val = event.target.value;
    if (!val) return;

    // Initial split by delimiters
    let names = val.split(/,|\s+and\s+/i).map((s: string) => s.trim()).filter((s: string) => s.length > 0);

    // Quick heuristic: If we have 4+ words and no commas, it might be missed spaces
    // We'll let the user manually fix if needed, but we can try to warn or split if obvious
    // In the modal, we have a more manual control, so we mainly split by common delimiters.

    this.paper.authors = names.map((name: string, index: number) => ({
      name: name.replace(/[*†‡§]/g, '').trim(),
      role: 'Author',
      contributionPercentage: index + 1
    })).filter((a: Author) => a.name.length > 0);
  }

  addAuthor() {
    if (!this.paper.authors) this.paper.authors = [];
    this.paper.authors.push({
      name: '',
      role: 'Author',
      contributionPercentage: this.paper.authors.length + 1
    });
  }
  removeAuthor(index: number) { this.paper.authors.splice(index, 1); }

  getBulkAuthors(): string {
    return (this.paper.authors || []).map(a => a.name).filter(n => n.length > 0).join(', ');
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.showValidation.set(true);

    if (!this.paper.title) {
      this.errorMessage.set('⚠️ Paper Title is mandatory.');
      this.tab.set('basic');
      return;
    }

    if (this.errorMessage() && this.errorMessage().includes('exists')) {
      alert('Cannot save: Record already exists.');
      return;
    }

    if (this.isMetricDisabled() && !this.paper.publication!.impactFactor) {
      this.paper.publication!.impactFactor = 'NONE';
    }

    // Sanitize dates to avoid sending empty strings which break LocalDate deserialization
    if (!this.paper.submissionDate) this.paper.submissionDate = undefined;
    if (!this.paper.decisionDate) this.paper.decisionDate = undefined;
    if (!this.paper.publicationDate) this.paper.publicationDate = undefined;

    if (this.paper.pid === null || this.paper.pid === undefined) this.paper.pid = 0;
    if (this.paper.authorPlace === null || this.paper.authorPlace === undefined) this.paper.authorPlace = 1;

    this.researchService.save(this.paper).subscribe({
      next: (saved) => {
        this.successMessage.set('✨ Changes saved to database!');
        this.researchService.lastActionItemId.set(saved.id || null);

        // Auto-clear highlight after 5s
        setTimeout(() => this.researchService.lastActionItemId.set(null), 5000);

        // Delay close to show success
        setTimeout(() => this.close.emit(), 1000);
      },
      error: (err) => {
        console.error('Failed to save research:', err);
        const msg = err.error?.message || err.message || 'Unknown error';
        if (msg.toLowerCase().includes('duplicate') || msg.toLowerCase().includes('exists')) {
          this.errorMessage.set('⚠️ Duplicate detected: Title, Publication, and Year must be unique.');
        } else {
          alert('Failed to save: ' + msg);
        }
      }
    });
  }
}
