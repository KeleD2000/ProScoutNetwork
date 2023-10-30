import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ScoutService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  registerScout(scoutData: any){
    return this.http.post(`${this.baseUrl}/api/register_scout`, scoutData);
  }
}
