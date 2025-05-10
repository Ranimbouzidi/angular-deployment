import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  public getAuthHeaders(): HttpHeaders {
    // Try to get current user from localStorage
    const currentUserStr = localStorage.getItem('currentUser');
    
    if (currentUserStr) {
      try {
        const currentUser = JSON.parse(currentUserStr);
        const username = currentUser.email;
        const password = ''; // We don't store the password in localStorage for security
        
        // If we have the user's email, use it for authentication
        if (username) {
          const basicAuth = 'Basic ' + btoa(`${username}:${password}`);
          return new HttpHeaders({
            'Authorization': basicAuth
          });
        }
      } catch (e) {
        console.error('Error parsing currentUser from localStorage:', e);
      }
    }
    
    // Fallback to default credentials
    const username = 'admin@admin.com';
    const password = 'admin123';
    const basicAuth = 'Basic ' + btoa(`${username}:${password}`);

    return new HttpHeaders({
      'Authorization': basicAuth
    });
  }
}
