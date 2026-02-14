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
          <button [class.active]="tab() === 'dates'" (click)="tab.set('dates')">Timeline</button>
        </div>

        <form (submit)="onSubmit($event)" class="modal-body">
          <div *ngIf="tab() === 'basic'" class="tab-pane">
            <div class="field-row">
              <div class="field-group full">
                <label>Paper Title</label>
                <input type="text" [(ngModel)]="paper.title" name="title" required class="input-field" placeholder="Entry title...">
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
                <select [(ngModel)]="paper.publication!.type" name="pubType" class="input-field">
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
              <input type="text" [(ngModel)]="paper.publication!.name" name="pubName" class="input-field" placeholder="e.g. Nature, ICC, EuroS&P...">
            </div>
            <div class="field-group">
              <label>Publisher Name</label>
              <input type="text" [(ngModel)]="paper.publication!.publisher" name="pubPublisher" class="input-field" placeholder="e.g. IEEE, Springer...">
            </div>
            <div class="field-row triple">
              <div class="field-group">
                <label>Year</label>
                <input type="text" [(ngModel)]="paper.publication!.year" name="pubYear" class="input-field" placeholder="202X">
              </div>
              <div class="field-group">
                <label>Impact Factor</label>
                <input type="number" step="0.001" [(ngModel)]="paper.publication!.impactFactor" name="pubImpact" class="input-field" placeholder="0.000" [disabled]="isQuartileDisabled()">
              </div>
              <div class="field-group">
                <label>Journal Quartile</label>
                <select [(ngModel)]="paper.publication!.quartile" name="pubQuartile" class="input-field" [disabled]="isQuartileDisabled()">
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
                <label>Technical Notes</label>
                <textarea [(ngModel)]="paper.notes" name="notes" class="input-field" rows="4" placeholder="Private observations..."></textarea>
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
      backdrop-filter: blur(12px) saturate(180%); 
      display: flex; align-items: center; justify-content: center; 
      z-index: 3000; padding: 2rem; 
    }
    .modal-container { 
      width: 100%; max-width: 680px; display: flex; flex-direction: column; overflow: hidden; 
      background: white; border-radius: 24px; border: 1px solid var(--border-glass);
      box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.25);
    }
    .modal-header { 
      padding: 1.75rem 2.5rem; display: flex; justify-content: space-between; align-items: center; 
      background: white; border-bottom: 1px solid var(--border-dim);
    }
    .modal-header h2 { font-size: 1.25rem; font-weight: 800; color: var(--text-main); letter-spacing: -0.03em; }
    .btn-close { 
      background: var(--bg-main); border: 1px solid var(--border-glass); 
      width: 32px; height: 32px; border-radius: 10px; display: grid; place-items: center;
      cursor: pointer; color: var(--text-dim); transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .btn-close:hover { background: white; border-color: #ef4444; color: #ef4444; transform: rotate(90deg); }

    .modal-tabs { 
      display: flex; gap: 0.25rem; background: var(--bg-main); 
      padding: 0.4rem; margin: 0 2.5rem; margin-top: 1.5rem; 
      border-radius: 14px; border: 1px solid var(--border-dim);
    }
    .modal-tabs button { 
      flex: 1; padding: 0.625rem; border: none; background: transparent; 
      font-size: 0.8125rem; font-weight: 700; color: var(--text-dim); 
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
      font-size: 0.625rem; font-weight: 800; color: var(--text-muted); 
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
  private researchService = inject(ResearchService);
  @Output() close = new EventEmitter<void>();

  tab = signal('basic');
  paper: Research = this.getEmptyPaper();

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
      tags: [], featured: false, notes: ''
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

  isQuartileDisabled() {
    return this.paper.publication!.type === 'CONFERENCE';
  }

  onJournalNameChange() {
    const name = (this.paper.publication!.name || '').toLowerCase();
    const journalMap: Record<string, string> = {
      'discover computing': 'Q2',
      'i-st computer science': 'Q2',
      'biomedical materials & devices': 'Q2',
      'heliyon': 'Q1',
      'journal of neuroscience methods': 'Q3',
      'ieee access': 'Q1',
      'data in brief': 'Q3',
      'open cell signaling': 'Q4'
    };

    for (const [key, value] of Object.entries(journalMap)) {
      if (name.includes(key)) {
        this.paper.publication!.quartile = value;
        break;
      }
    }
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
    if (this.isQuartileDisabled() && !this.paper.publication!.impactFactor) {
      this.paper.publication!.impactFactor = 'NONE';
    }
    event.preventDefault();
    this.researchService.save(this.paper).subscribe(() => this.close.emit());
  }
}
