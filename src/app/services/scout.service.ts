import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Scout } from '../model/Scout';

@Injectable({
  providedIn: 'root'
})
export class ScoutService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  registerScout(scoutData: Scout){
    return this.http.post(`${this.baseUrl}/api/register_scout`, scoutData);
  }
}
