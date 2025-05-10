import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { BaseService } from '../base.service';

export interface RevenuePredictionResponse {
  totalRevenueLast30Days: number;
  totalRevenuePrevious30Days: number;
  averageDailyRevenue: number;
  predictedRevenueNext30Days: number;
  growthRate: number;
  tendance: string;
}

@Injectable({
  providedIn: 'root'
})
export class RevenueService {
  private apiUrl = environment.backend_url + 'revenue/predict/';

  constructor(
    private http: HttpClient,
    private baseService: BaseService
  ) {}

  getRevenuePrediction(userId: number): Observable<RevenuePredictionResponse> {
    const url = this.apiUrl + userId;
    console.log('URL complète:', url);
    
    // Récupérer les headers d'authentification
    const headers = this.baseService.getAuthHeaders();
    
    // Vérifier si l'URL est correcte
    if (!url.startsWith('http')) {
      console.error('URL invalide:', url);
      return throwError(() => new Error('URL invalide'));
    }

    return this.http.get<RevenuePredictionResponse>(url, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur détaillée:', {
          status: error.status,
          message: error.message,
          url: error.url,
          error: error.error,
          headers: error.headers
        });
        return throwError(() => error);
      })
    );
  }
}
