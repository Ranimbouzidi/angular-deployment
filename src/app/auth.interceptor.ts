import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private baseService: BaseService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip adding auth headers for public endpoints
    if (request.url.includes('/auth/login') || 
        request.url.includes('/users/register') ||
        request.url.includes('/users/forgot-password') ||
        request.url.includes('/users/reset-password')) {
      return next.handle(request);
    }

    // Get auth headers from base service
    const authHeaders = this.baseService.getAuthHeaders();
    
    // Clone the request and add the auth headers
    const authRequest = request.clone({
      headers: authHeaders
    });

    return next.handle(authRequest);
  }
}
