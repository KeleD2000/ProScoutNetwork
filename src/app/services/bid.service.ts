import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BidService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  connectUser(username: string): Observable<any> {
    const url = `${this.baseUrl}/api/bid/connect/${username}`;

    return this.http.post(url, {});
  }

  getConnectUser(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/bid/connected`);
  }
}
