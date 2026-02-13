import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface Author {
    id?: number;
    name: string;
    role: string;
    contributionPercentage: number;
}

export interface HistoryEntry {
    id: number;
    changeType: string;
    oldValue: string;
    newValue: string;
    timestamp: string;
    researchId?: number;
    fieldName?: string;
}

export interface Research {
    id?: number;
    status: string;
    pid: number;
    title: string;
    paperType: string;
    authorPlace: number;
    authors: Author[];
    publisherName: string;
    publisherYear: string;
    journalQuartile: string;
    paperUrl?: string;
    overleafUrl?: string;
    driveUrl?: string;
    datasetUrl?: string;
    publicVisibility: string;
    tags: string[];
    featured: boolean;
    notes?: string;
    submissionDate?: string;
    decisionDate?: string;
    publicationDate?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ResearchService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/api/research';

    // Signals for state
    researchItems = signal<Research[]>([]);
    history = signal<HistoryEntry[]>([]);
    analytics = signal<any>(null);
    loading = signal<boolean>(false);

    loadAll(): void {
        this.loading.set(true);
        this.http.get<Research[]>(this.apiUrl).subscribe({
            next: (items) => {
                console.log('RESEARCH SERVICE: Loaded items:', items);
                this.researchItems.set(items);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    loadHistory(): void {
        this.http.get<HistoryEntry[]>(`${this.apiUrl}/history`).subscribe(
            data => this.history.set(data)
        );
    }

    loadAnalytics(): void {
        this.http.get<any>(`${this.apiUrl}/analytics`).subscribe(
            data => this.analytics.set(data)
        );
    }

    save(research: Research): Observable<Research> {
        return this.http.post<Research>(this.apiUrl, research).pipe(
            tap(() => {
                this.loadAll();
                this.loadAnalytics();
                this.loadHistory();
            })
        );
    }

    bulkSave(researches: Research[]): Observable<Research[]> {
        return this.http.post<Research[]>(`${this.apiUrl}/bulk`, researches).pipe(
            tap(() => {
                this.loadAll();
                this.loadAnalytics();
                this.loadHistory();
            })
        );
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            tap(() => {
                this.loadAll();
                this.loadAnalytics();
                this.loadHistory();
            })
        );
    }

    deleteAll(): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/all`).pipe(
            tap(() => {
                this.loadAll();
                this.loadAnalytics();
                this.loadHistory();
            })
        );
    }

    fetchMetadata(doi: string): Observable<Research> {
        return this.http.get<Research>(`${this.apiUrl}/fetch-metadata`, { params: { doi } });
    }

    importCsv(file: File): Observable<Research[]> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<Research[]>(`${this.apiUrl}/import`, formData).pipe(
            tap(() => {
                this.loadAll();
                this.loadAnalytics();
            })
        );
    }

    exportCsv(): void {
        this.http.get(`${this.apiUrl}/export`, { responseType: 'blob' }).subscribe(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'research_portfolio.csv';
            a.click();
            window.URL.revokeObjectURL(url);
        });
    }
}
