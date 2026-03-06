import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface JournalMetadata {
    name: string;
    publisher: string;
    impactFactor: string;
    quartile: string;
    url: string;
    year: number;
}

export interface ConferenceMetadata {
    name: string;
    venue: string;
    indexedBy: string;
    url: string;
    year: number;
}

@Injectable({
    providedIn: 'root'
})
export class MetadataService {
    private http = inject(HttpClient);
    private apiUrl = '/api/metadata';

    public journals = signal<JournalMetadata[]>([]);
    public conferences = signal<ConferenceMetadata[]>([]);
    public loading = signal<boolean>(false);

    loadAll(): void {
        this.loading.set(true);

        // Using simple subscribe for now, could use forkJoin for parallel
        this.http.get<JournalMetadata[]>(`${this.apiUrl}/journals`).subscribe({
            next: (data) => {
                this.journals.set(data);
                this.checkLoading();
            },
            error: () => this.loading.set(false)
        });

        this.http.get<ConferenceMetadata[]>(`${this.apiUrl}/conferences`).subscribe({
            next: (data) => {
                this.conferences.set(data);
                this.checkLoading();
            },
            error: () => this.loading.set(false)
        });
    }

    private checkLoading(): void {
        // If both are potentially loaded or errors happened
        // In a real app we'd track both separately
        this.loading.set(false);
    }

    getJournals(): Observable<JournalMetadata[]> {
        return this.http.get<JournalMetadata[]>(`${this.apiUrl}/journals`);
    }

    getConferences(): Observable<ConferenceMetadata[]> {
        return this.http.get<ConferenceMetadata[]>(`${this.apiUrl}/conferences`);
    }
}
