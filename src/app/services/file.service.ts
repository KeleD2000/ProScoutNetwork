import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  fileUpload(data: FormData){
    return this.http.post(`${this.baseUrl}/api/upload`, data);
  }

  getProfilePicBlob(username: any): Observable<Blob> {
    const imageUrl = `${this.baseUrl}/api/profilkep/${username}`;

    return this.http.get(imageUrl, { responseType: 'blob' });
  }

  deleteProfilPic(username: any): Observable<any>{
    return this.http.delete(`${this.baseUrl}/deleteProfilePic/${username}`);
  }
  
}
