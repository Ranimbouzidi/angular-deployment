import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Ne pas ajouter d'Authorization sur les appels d'inscription et de login
    if (
      req.url.includes('/login') ||
      req.url.includes('/register') ||
      req.url.includes('/verify-code')
    ) {
      return next.handle(req);
    }

    // Récupération du token dans le localStorage
    const token = localStorage.getItem('token');

    // Si token présent, on ajoute le header Authorization
    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next.handle(authReq);
    }

    // Sinon on envoie la requête telle quelle
    return next.handle(req);
  }
}
