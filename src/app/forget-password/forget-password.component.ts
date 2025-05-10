import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent {
  email: string = '';
  code: string = '';
  newPassword: string = '';
  step: 'request' | 'reset' = 'request';
  message: string = '';
  error: string = '';

  constructor(private http: HttpClient) {}

  sendResetCode() {
    this.http.post(`${environment.backend_url}auth/request-reset`, null, {
      params: { email: this.email }
    }).subscribe({
      next: (res: any) => {
        this.message = res.message;
        this.error = '';
        this.step = 'reset';
      },
      error: (err) => {
        this.error = err.error?.error || 'Erreur lors de l’envoi du code';
        this.message = '';
      }
    });
  }

  resetPassword() {
    this.http.post(`${environment.backend_url}auth/reset-password`, {
      email: this.email,
      code: this.code,
      newPassword: this.newPassword
    }).subscribe({
      next: (res: any) => {
        this.message = res.message;
        this.error = '';
        setTimeout(() => location.href = '/connexion', 2000); // redirection
      },
      error: (err) => {
        this.error = err.error?.error || 'Échec de la réinitialisation';
        this.message = '';
      }
    });
  }
}
