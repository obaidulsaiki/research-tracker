import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CameraReadyTask } from './research.service';

@Injectable({
    providedIn: 'root'
})
export class ChecklistService {
    private http = inject(HttpClient);
    private apiUrl = '/api/checklist';

    toggleTask(researchId: number, taskKey: string, completed: boolean): Observable<CameraReadyTask> {
        const params = new HttpParams()
            .set('taskKey', taskKey)
            .set('completed', completed.toString());

        return this.http.post<CameraReadyTask>(`${this.apiUrl}/${researchId}/toggle`, {}, { params });
    }
}
