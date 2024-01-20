import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {

   }

   getAllReports(){
    return this.http.get(`${this.baseUrl}/api/reports`);
   }
}
