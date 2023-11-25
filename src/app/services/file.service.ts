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

  pdfFileUpload(data: FormData){
    return this.http.post(`${this.baseUrl}/api/uploadPdf`, data);

  }

  videoFileUpload(data: FormData){
    return this.http.post(`${this.baseUrl}/api/uploadVideo`, data);
  }

  downloadPdf(fileId: number): Observable<Blob> {
    const url = `${this.baseUrl}/api/downloadPdf/${fileId}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  downloadVideo(fileId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/videos/${fileId}/download`, { responseType: 'arraybuffer' });
  }

  getProfilePicBlob(username: any): Observable<Blob> {
    const imageUrl = `${this.baseUrl}/api/profilkep/${username}`;

    return this.http.get(imageUrl, { responseType: 'blob' });
  }

  deleteProfilPic(username: any){
    return this.http.delete(`${this.baseUrl}/api/deleteProfilePic/${username}`);
  }

  getCurrentUser(username: any){
    const url =`${this.baseUrl}/api/current-user/${username}`;

    return this.http.get(url, username);
  }
  
}
