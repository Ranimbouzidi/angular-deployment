import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';
import { Pack } from '../models/pack';
import { Paiement } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class UserSubscriptionService extends BaseService {
  private apiUrl = environment.backend_url;

  constructor(private http: HttpClient) {
    super();
  }

  getUserSubscriptions(userId: number): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(`${this.apiUrl}paiements/users/${userId}/subscriptions`, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }

  getActiveSubscription(userId: number): Observable<Paiement> {
    return this.http.get<Paiement>(`${this.apiUrl}paiements/users/${userId}/active-subscription`, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }

  calculateSubscriptionStatus(payment: Paiement): { status: string, daysRemaining: number } {
    const startDate = new Date(payment.datePaiement);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + payment.packAbonnement.duree);
    
    const now = new Date();
    const daysRemaining = Math.floor((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    let status = 'Actif';
    if (daysRemaining <= 0) {
      status = 'Expiré';
    } else if (daysRemaining <= 7) {
      status = 'Expiration proche';
    }
    
    return { status, daysRemaining };
  }
} 