import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-verify-code',
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.scss']
})
export class VerifyCodeComponent implements OnInit {
  email: string = '';
  code: string = '';
  message: string = '';
  error: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const storedEmail = localStorage.getItem('verifyEmail');
    if (storedEmail) {
      this.email = storedEmail;
    }
  }

  verifyCode() {
    if (!this.email || !this.code) return;

    this.http.post<any>(`${environment.backend_url}auth/verify`, {
      email: this.email,
      code: this.code
    }).subscribe({
      next: (res) => {
        this.message = res.message;
        this.error = '';
        localStorage.removeItem('verifyEmail');
        setTimeout(() => this.router.navigate(['/connexion']), 2000);
      },
      error: (err) => {
        this.error = err.error?.error || 'Erreur lors de la vérification';
        this.message = '';
      }
    });
  }
}
