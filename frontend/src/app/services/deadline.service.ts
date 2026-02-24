import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface ConferenceDeadline {
    id?: number;
    conferenceName: string;
    submissionDeadline: string;
    url?: string;
    notes?: string;
    priority?: string;
    discoveredAutomatically?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class DeadlineService {
    private http = inject(HttpClient);
    private apiUrl = '/api/deadlines';

    public deadlines = signal<ConferenceDeadline[]>([]);

    constructor() {
        this.loadDeadlines();
    }

    loadDeadlines() {
        console.log('DEADLINE SERVICE: Fetching from', this.apiUrl);
        this.http.get<ConferenceDeadline[]>(this.apiUrl).subscribe({
            next: (data) => {
                console.log('DEADLINE SERVICE: Received', data.length, 'deadlines');
                this.deadlines.set(data);
            },
            error: (err) => {
                console.error('DEADLINE SERVICE: Fetch failed!', err);
            }
        });
    }

    addDeadline(deadline: ConferenceDeadline) {
        return this.http.post<ConferenceDeadline>(this.apiUrl, deadline).subscribe(() => {
            this.loadDeadlines();
        });
    }

    deleteDeadline(id: number) {
        return this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
            this.loadDeadlines();
        });
    }

    refresh() {
        this.loadDeadlines();
    }

    searchDeadlines(query: string) {
        return this.http.get<ConferenceDeadline[]>(`${this.apiUrl}/search?q=${query}`);
    }

    autonomousScan() {
        return this.http.post(`${this.apiUrl}/scan`, {});
    }
}
