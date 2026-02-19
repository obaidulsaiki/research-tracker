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

export interface Publication {
    id?: number;
    type: string;
    name: string;
    publisher: string;
    year: string;
    venue: string;
    impactFactor: string;
    quartile: string;
    url: string;
}

export interface JournalMetadata {
    name: string;
    publisher: string;
    impactFactor: string;
    quartile: string;
    url: string;
    venue?: string;
    indexedBy?: string;
}

export interface Research {
    id?: number;
    status: string;
    pid: number;
    title: string;
    publication: Publication | null; // Replaces flat fields
    authorPlace: number;
    authors: Author[];
    paperUrl?: string; // This is the direct link that matches backend @URL
    overleafUrl?: string;
    driveUrl?: string;
    datasetUrl?: string;
    publicVisibility: string;
    tags: string[];
    featured: boolean;
    synopsis?: string;
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
    public lastActionItemId = signal<number | null>(null);
    public researchItems = signal<Research[]>([]);
    public history = signal<HistoryEntry[]>([]);
    public analytics = signal<any>(null);
    public loading = signal<boolean>(false);

    refresh(): void {
        this.loadAll();
        this.loadHistory();
        this.loadAnalytics();
    }

    loadAll(): void {
        this.loading.set(true);
        this.http.get<Research[]>(this.apiUrl).subscribe({
            next: (items) => {
                // NORMALIZATION: Split IF/Quartile if they are merged in legacy records
                const normalized = items.map(item => {
                    if (item.publication) {
                        const ifVal = String(item.publication.impactFactor || '').trim();
                        const qVal = String(item.publication.quartile || '').trim();

                        // If IF field contains a Quartile (Q1, Q2...) and Quartile is empty
                        if (/^[Qq][1-4]$/.test(ifVal) && (!qVal || qVal === 'N/A' || qVal === '---')) {
                            item.publication.quartile = ifVal.toUpperCase();
                            item.publication.impactFactor = '0.0';
                        }

                        // Default quartile if missing
                        if (!item.publication.quartile) item.publication.quartile = 'N/A';
                    }
                    return item;
                });

                console.log('RESEARCH SERVICE: Loaded items:', normalized);
                this.researchItems.set(normalized);
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
            tap((saved) => {
                this.lastActionItemId.set(saved.id || null);
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

    importExcel(file: File): Observable<Research[]> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<Research[]>(`${this.apiUrl}/import/excel`, formData).pipe(
            tap(() => {
                this.loadAll();
                this.loadAnalytics();
            })
        );
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

    lookupJournal(name: string): Observable<JournalMetadata> {
        return this.http.get<JournalMetadata>(`${this.apiUrl}/journal-lookup`, { params: { name } });
    }

    checkDuplicate(paper: Research): Observable<{ exists: boolean }> {
        return this.http.post<{ exists: boolean }>(`${this.apiUrl}/check-duplicate`, paper);
    }
}
