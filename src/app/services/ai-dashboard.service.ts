import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AnalysisDashboardDTO,
  AnalysisResultDTO,
} from '../models/ai.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AiDashboardService {
  private baseUrl = environment.backend_url + 'admin/dashboard';

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<AnalysisDashboardDTO> {
    return this.http.get<AnalysisDashboardDTO>(this.baseUrl);
  }

  getUserAnalysis(userId: number): Observable<AnalysisResultDTO> {
    return this.http.get<AnalysisResultDTO>(`${this.baseUrl}/users/${userId}/analysis`);
  }
}
