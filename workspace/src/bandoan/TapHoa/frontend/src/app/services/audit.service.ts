import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuditService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/audits`;

    getAudits(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }
}
