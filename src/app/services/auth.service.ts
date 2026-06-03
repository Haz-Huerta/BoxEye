import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  saveToken(token: string): void {

    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }

  }

  getToken(): string | null {

    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }

    return null;
  }

  logout(): void {

    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
    }

  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  saveUser(user: any): void {

  localStorage.setItem(
    'usuario',
    JSON.stringify(user)
  );

}

getUser(): any {

  const user = localStorage.getItem('usuario');

  return user
    ? JSON.parse(user)
    : null;

}

isAdmin(): boolean {

  const token = this.getToken();

  const user = this.getUser();

  return user?.rol === 'admin';

}

}