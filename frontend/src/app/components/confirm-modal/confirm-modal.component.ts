import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" (click)="cancel.emit()">
      <div class="confirm-card animate-pop-in" (click)="$event.stopPropagation()">
        <div class="confirm-icon">⚠️</div>
        <h3>{{ title }}</h3>
        <p>{{ message }}</p>
        
        <div class="confirm-actions">
          <button class="btn-cancel" (click)="cancel.emit()">Cancel</button>
          <button class="btn-danger" (click)="confirm.emit()">{{ confirmText }}</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed; inset: 0; background: hsla(222, 47%, 8%, 0.4);
      backdrop-filter: blur(12px) saturate(180%); display: flex; align-items: center;
      justify-content: center; z-index: 3000;
    }
    .confirm-card {
      background: white; width: 100%; max-width: 440px; padding: 2.5rem;
      border-radius: 24px; text-align: center; border: 1px solid var(--border-glass);
      box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.1);
    }
    .confirm-icon {
      font-size: 3.5rem; margin-bottom: 1.5rem; filter: drop-shadow(0 0 15px hsla(45, 93%, 47%, 0.2));
    }
    h3 { font-size: 1.5rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.75rem; letter-spacing: -0.02em; }
    p { color: var(--text-dim); font-size: 1rem; line-height: 1.6; margin-bottom: 2.5rem; }
    
    .confirm-actions { display: flex; gap: 1rem; }
    .confirm-actions button {
      flex: 1; padding: 1rem; border: none; border-radius: 14px;
      font-weight: 800; font-size: 0.9375rem; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .btn-cancel { background: hsla(210, 40%, 98%, 1); color: var(--text-dim); border: 1px solid var(--border-glass); }
    .btn-cancel:hover { background: white; border-color: var(--accent-primary); color: var(--accent-primary); transform: translateY(-2px); }
    
    .btn-danger { background: hsla(0, 84%, 60%, 1); color: white; box-shadow: 0 8px 20px -5px hsla(0, 84%, 60%, 0.3); }
    .btn-danger:hover { filter: brightness(1.1); transform: translateY(-3px) scale(1.02); box-shadow: 0 12px 25px -5px hsla(0, 84%, 60%, 0.4); }
    
    .animate-pop-in { animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
    @keyframes popIn {
      0% { opacity: 0; transform: scale(0.9) translateY(10px); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }
  `]
})
export class ConfirmModalComponent {
  @Input() title = 'Confirm Deletion';
  @Input() message = 'Are you sure you want to permanently delete this research record? This action cannot be undone.';
  @Input() confirmText = 'Yes, Delete It';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
