import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScoutAdsService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  
  fileAdsUpload(data: FormData, username: string){
    return this.http.post(`${this.baseUrl}/api/uploadScoutAds/${username}`, data);
  }

  modifyAds(data: FormData, adId: number){
    return this.http.put(`${this.baseUrl}/api/updateScoutAd/` + adId, data);
  }

  deleteAds(adId: number){
    return this.http.delete(`${this.baseUrl}/api/deleteScoutAd/` + adId);
  }

  getAllScoutAds(){
    return this.http.get(`${this.baseUrl}/api/scoutAds`);
  }
  
  getAdsPic(adId: number): Observable<Blob> {
    const imageUrl = `${this.baseUrl}/api/adsScoutImage/${adId}`;

    return this.http.get(imageUrl, { responseType: 'blob' });
  }

  searchByScout(searchTerm: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/search-scout`, { params: { searchTerm: searchTerm } });
  }

  searchByPlayer(searchTerm: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/search-player`, { params: { searchTerm: searchTerm } });
  }

}