import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BaseService } from '../base.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecuService extends BaseService {
  

  constructor(private http: HttpClient) {
    super();
  }

  async downloadRecuPdf(paiementId: number): Promise<Blob> {
    const response = await firstValueFrom(
      this.http.get(`${environment.backend_url}recu/${paiementId}/pdf`, {
        headers: this.getAuthHeaders(),
        responseType: 'blob',
        withCredentials: true
      })
    );
    
    if (!response) {
      throw new Error('No PDF data received');
    }
    
    return response;
  }
} 