import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerAdsService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  fileAdsUpload(data: FormData, username: string){
    return this.http.post(`${this.baseUrl}/api/uploadAds/${username}`, data);
  }

  modifyAds(data: FormData, adId: number){
    return this.http.put(`${this.baseUrl}/api/updateAd/` + adId, data);
  }

  getAllPlayerAds(){
    return this.http.get(`${this.baseUrl}/api/playerAds`);
  }
  
  getAdsPic(adId: number): Observable<Blob> {
    const imageUrl = `${this.baseUrl}/api/adsImage/${adId}`;

    return this.http.get(imageUrl, { responseType: 'blob' });
  }
}
