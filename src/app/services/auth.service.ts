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

  constructor(private http: HttpClient, private router: Router) {

   }

  registerScout(scoutData: Scout){
    return this.http.post(`${this.baseUrl}/api/register_scout`, scoutData);
  }
  registerPlayer(playerData: Player){
    return this.http.post(`${this.baseUrl}/api/register_player`, playerData);
  }

  login(loginUser: LoginUser){
    return this.http.post<LoginResponse>(`${this.baseUrl}/api/login`, loginUser);
  }

}
