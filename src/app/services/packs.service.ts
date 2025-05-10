import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Pack } from '../models/pack';
import { BaseService } from '../base.service';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PacksService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  getAllPacks(): Observable<Pack[]> {
    return this.http.get<Pack[]>(`${environment.backend_url}packs`, { headers: this.getAuthHeaders() });
  }

  // New method to create a pack
  createPack(pack: Pack): Observable<Pack> {
    return this.http.post<Pack>(`${environment.backend_url}packs`, pack, { headers: this.getAuthHeaders() });
  }

  // New method to delete a pack by ID
  deletePack(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.backend_url}packs/${id}`, { headers: this.getAuthHeaders() });
  
  }
  getPackStats(): Observable<any> {
    return this.http.get<any>(`${environment.backend_url}packs/stats`, {
      headers: this.getAuthHeaders()
    });
  } 
  updatePack(id: number, pack: Pack): Observable<any> {
    return this.http.put(`${environment.backend_url}packs/${id}`, pack, {
      headers: this.getAuthHeaders()
    });
  }
  getMonthlyStats(): Observable<{ [month: string]: { [type: string]: number } }> {
    return this.http.get<{ [month: string]: { [type: string]: number } }>(
      `${environment.backend_url}packs/stats-mensuelles`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => {
        // S'assurer que tous les types de packs sont présents pour chaque mois
        const allTypes = new Set<string>();
        Object.values(response).forEach(monthData => {
          Object.keys(monthData).forEach(type => allTypes.add(type));
        });

        // Compléter les données manquantes avec 0
        Object.keys(response).forEach(month => {
          allTypes.forEach(type => {
            if (!response[month][type]) {
              response[month][type] = 0;
            }
          });
        });

        return response;
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération des statistiques:', error);
        throw error;
      })
    );
  }
}
