import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface Conference {
    id?: number;
    name: string;
    shortName: string;
    year: number;
    publisher?: string;
    portalLink?: string;
    platformLink?: string;
    platformName?: string;
    submissionDeadline?: string;
    notificationDate?: string;
    cameraReadyDeadline?: string;
    registrationDeadline?: string;
    conferenceDate?: string;
    papers?: any[]; // Using any[] temporarily or import Research if possible
}

@Injectable({
    providedIn: 'root'
})
export class ConferenceService {
    private http = inject(HttpClient);
    private apiUrl = '/api/conferences';

    public conferences = signal<Conference[]>([]);
    public loading = signal<boolean>(false);

    loadAll(): void {
        this.loading.set(true);
        this.http.get<Conference[]>(this.apiUrl).subscribe({
            next: (items) => {
                this.conferences.set(items);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    create(conference: Conference): Observable<Conference> {
        return this.http.post<Conference>(this.apiUrl, conference).pipe(
            tap(() => this.loadAll())
        );
    }

    update(id: number, conference: Conference): Observable<Conference> {
        return this.http.put<Conference>(`${this.apiUrl}/${id}`, conference).pipe(
            tap(() => this.loadAll())
        );
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            tap(() => this.loadAll())
        );
    }
}
