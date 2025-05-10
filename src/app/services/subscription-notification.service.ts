import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from '../base.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionNotificationService extends BaseService {
 

  constructor(private http: HttpClient) {
    super();
  }

  async checkExpiringSubscriptions(): Promise<void> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getAuthHeaders().get('Authorization') || ''
    });

    await firstValueFrom(
      this.http.post(
        `${environment.backend_url}subscriptions/check-expiring`,
        null,
        {
          headers,
          withCredentials: true
        }
      )
    );
  }

  async sendRenewalConfirmation(paiementId: number): Promise<void> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getAuthHeaders().get('Authorization') || ''
    });

    await firstValueFrom(
      this.http.post(
        `${environment.backend_url}subscriptions/${paiementId}/send-renewal-confirmation`,
        null,
        {
          headers,
          withCredentials: true
        }
      )
    );
  }

  async sendTestNotification(email: string, username: string, packName: string, daysUntilExpiration: number): Promise<void> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getAuthHeaders().get('Authorization') || ''
    });

    await firstValueFrom(
      this.http.post(
        `${environment.backend_url}subscriptions/test-notification`,
        null,
        {
          params: {
            email,
            username,
            packName,
            daysUntilExpiration: daysUntilExpiration.toString()
          },
          headers,
          withCredentials: true
        }
      )
    );
  }
} 