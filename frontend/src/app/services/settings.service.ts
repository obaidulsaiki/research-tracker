import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface SystemSettings {
    id?: number;
    autoBackupEnabled: boolean;
    backupIntervalHours: number;
    lastBackupTime?: string;
}

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/api/settings';

    settings = signal<SystemSettings | null>(null);

    loadSettings(): void {
        this.http.get<SystemSettings>(this.apiUrl).subscribe(
            data => this.settings.set(data)
        );
    }

    updateSettings(settings: SystemSettings): Observable<SystemSettings> {
        return this.http.post<SystemSettings>(this.apiUrl, settings).pipe(
            tap(updated => this.settings.set(updated))
        );
    }

    triggerManualBackup(): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/trigger-backup`, {});
    }
}
