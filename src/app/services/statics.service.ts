import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StaticsService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  avgAdCount(){
     return this.http.get(`${this.baseUrl}/api/avgAdCount`);
  }

  averagePercentageBySport(){
    return this.http.get(`${this.baseUrl}/api/averagePercentageBySport`);
  }

  averagePercentageBySportScout(){
    return this.http.get(`${this.baseUrl}/api/averagePercentageBySportScout`);
  }

  topPlayerBySports(){
    return this.http.get(`${this.baseUrl}/api/topPlayerBySports`);
  }

  topScoutBySports(){
    return this.http.get(`${this.baseUrl}/api/topScoutBySports`);
  }

}
