import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Scout } from '../model/Scout';
import { Player } from '../model/Player';
import { LoginUser } from '../model/LoginUser';

import { BehaviorSubject, tap } from 'rxjs';
import { LoginResponse } from '../model/LoginResponse';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080';
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn$.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('token');
    this._isLoggedIn$.next(!!token);
   }

  registerScout(scoutData: Scout){
    return this.http.post(`${this.baseUrl}/api/register_scout`, scoutData);
  }
  registerPlayer(playerData: Player){
    return this.http.post(`${this.baseUrl}/api/register_player`, playerData);
  }

  login(loginUser: LoginUser){
    return this.http.post<LoginResponse>(`${this.baseUrl}/api/login`, loginUser).pipe(
      tap((res: LoginResponse) => {
        this._isLoggedIn$.next(true);
        localStorage.setItem('token', res.token);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/signin']);
    this._isLoggedIn$.next(false);
  }

}
