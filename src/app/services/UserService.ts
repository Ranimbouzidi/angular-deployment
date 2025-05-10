import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, tap } from 'rxjs';
import { User } from '../models/user';
import { environment } from '../../environments/environment';
import { BaseService } from '../base.service';

// Interface pour l'enregistrement qui rend tous les champs optionnels sauf ceux nécessaires
interface RegisterUser extends Partial<User> {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.backend_url}users`, { headers: this.getAuthHeaders() });
  }

  login(email: string, motDePasse: string): Observable<User> {
    return this.http.post<User>(
      environment.backend_url + 'auth/login',
      { email, motDePasse },
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(response => {
        console.log('Login réussi:', response);
      }),
      catchError(error => {
        console.error('Erreur de login:', error);
        throw error;
      })
    );
  }

  addUser(user: User | RegisterUser): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    
    // Ne garder que les champs nécessaires pour l'enregistrement
    const { nom, prenom, email, motDePasse, role } = user;
    const registerData = { nom, prenom, email, motDePasse, role };
    
    return this.http.post<any>(
      `${environment.backend_url}users/register`,
      registerData,
      { 
        headers: headers,
        withCredentials: true
      }
    );
  }
  UpdateUser(user: User): Observable<any> {
    return this.http.put<any>(
      `${environment.backend_url}users/${user.id}`,
      user
    );
  }
  
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(environment.UserMs + '/' + id);
  }

  getUsersLength(): Observable<number> {
    return this.getAllUsers().pipe(map((users) => users.length));
  }

  getRHLength(): Observable<number> {
    return this.getAllUsers().pipe(
      map((users) => users.filter((user) => user.role === 'RH').length)
    );
  }

  getAdminLength(): Observable<number> {
    return this.getAllUsers().pipe(
      map((users) => users.filter((user) => user.role === 'ADMIN').length)
    );
  }

  checkEmailExists(email: string): Observable<boolean> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    
    return this.http.get<User[]>(`${environment.backend_url}users`, { 
      headers: headers,
      withCredentials: true
    }).pipe(
      map((users) => {
        return users.some((user) => user.email == email);
      })
    );
  }

  deleteUserById(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.backend_url}users/${id}`, { headers: this.getAuthHeaders() });
  }

  uploadPhoto(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
  
    return this.http.post<any>(
      `${environment.backend_url}uploads/user-photo`, 
      formData,
      { headers: this.getAuthHeaders() }
    );
  }
}
