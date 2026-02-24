import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CameraReadyTask } from './research.service';

@Injectable({
    providedIn: 'root'
})
export class MilestoneService {
    private http = inject(HttpClient);
    private apiUrl = '/api/research';

    getChecklist(researchId: number): Observable<CameraReadyTask[]> {
        return this.http.get<CameraReadyTask[]>(`${this.apiUrl}/${researchId}/checklist`);
    }

    toggleTask(researchId: number, taskKey: string, completed: boolean): Observable<CameraReadyTask> {
        return this.http.patch<CameraReadyTask>(`${this.apiUrl}/${researchId}/checklist/${taskKey}`, { completed });
    }
}
