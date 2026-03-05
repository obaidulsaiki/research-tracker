import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-loading-modal',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="modal-overlay">
      <div class="loading-card">
        <div class="spinner-container">
          <div class="outer-ring"></div>
          <div class="inner-ring"></div>
          <div class="core"></div>
        </div>
        <div class="text-content">
          <h3 class="loading-title">Processing Request</h3>
          <p class="loading-msg">{{ message || 'Please wait while we prepare your data...' }}</p>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar-fill"></div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      animation: fadeIn 0.3s ease;
    }

    .loading-card {
      background: white;
      padding: 3rem;
      border-radius: 24px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
      max-width: 400px;
      width: 90%;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .spinner-container {
      position: relative;
      width: 80px;
      height: 80px;
    }

    .outer-ring {
      position: absolute;
      width: 100%;
      height: 100%;
      border: 4px solid transparent;
      border-top-color: var(--p-accent, #2563eb);
      border-bottom-color: var(--p-accent, #2563eb);
      border-radius: 50%;
      animation: spin 1.5s linear infinite;
    }

    .inner-ring {
      position: absolute;
      top: 15%;
      left: 15%;
      width: 70%;
      height: 70%;
      border: 3px solid transparent;
      border-left-color: #6366f1;
      border-right-color: #6366f1;
      border-radius: 50%;
      animation: spin-reverse 1.2s linear infinite;
    }

    .core {
      position: absolute;
      top: 35%;
      left: 35%;
      width: 30%;
      height: 30%;
      background: var(--p-gradient, linear-gradient(135deg, #2563eb, #6366f1));
      border-radius: 50%;
      box-shadow: 0 0 15px rgba(37, 99, 235, 0.5);
      animation: pulse 1.5s ease-in-out infinite;
    }

    .text-content {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .loading-title {
      font-family: var(--font-display, sans-serif);
      font-size: 1.25rem;
      font-weight: 800;
      color: #1e293b;
      margin: 0;
    }

    .loading-msg {
      font-size: 0.9rem;
      color: #64748b;
      font-weight: 500;
      margin: 0;
    }

    .progress-bar-container {
      width: 100%;
      height: 6px;
      background: #f1f5f9;
      border-radius: 10px;
      overflow: hidden;
    }

    .progress-bar-fill {
      height: 100%;
      width: 30%;
      background: var(--p-gradient, linear-gradient(to right, #2563eb, #6366f1));
      border-radius: 10px;
      animation: progress-slide 2s infinite ease-in-out;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes spin-reverse {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(-360deg); }
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.1); opacity: 0.7; }
    }

    @keyframes progress-slide {
      0% { transform: translateX(-100%); width: 30%; }
      50% { width: 60%; }
      100% { transform: translateX(400%); width: 30%; }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `],
})
export class LoadingModalComponent {
    @Input() message?: string;
}
