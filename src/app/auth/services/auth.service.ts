import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { environment } from 'src/environments/environment';

import { AuthResponse, User } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _baseUrl: string = environment.baseUrl;
  private _user!: User;

  get getUser() {
    return { ...this._user };
  }

  constructor(private http: HttpClient) {}

  setToken(user: AuthResponse) {
    localStorage.setItem('token', user.token!);
    return (this._user = {
      name: user.name!,
      id: user.id!,
      email: user.email!,
    });
  }

  register(name: string, email: string, password: string) {
    const url = `${this._baseUrl}/auth/new`;
    const body = { name, email, password };

    return this.http.post<AuthResponse>(url, body).pipe(
      tap((newUser) => {
        if (newUser.ok) {
          this.setToken(newUser);
        }
      }),
      map((newUser) => newUser.ok),
      catchError((err) => of(err.error.msg))
    );
  }

  login(email: string, password: string) {
    const url = `${this._baseUrl}/auth`;
    const body = { email, password };
    return this.http.post<AuthResponse>(url, body).pipe(
      tap((authUser) => {
        if (authUser.ok) {
          this.setToken(authUser);
        }
      }),
      map((authUser) => authUser.ok),
      catchError((err) => of(err.error.msg))
    );
  }

  // Función para validar JWT para la protección de rutas
  validateJwt(): Observable<boolean> {
    const url = `${this._baseUrl}/auth/renew`;
    const headers = new HttpHeaders().set(
      'x-token',
      localStorage.getItem('token') || ''
    );

    return this.http.get<AuthResponse>(url, { headers }).pipe(
      map((authUser) => {
        this.setToken(authUser);
        return authUser.ok;
      }),
      catchError((err) => of(false))
    );
  }

  logout() {
    localStorage.clear();
  }
}
