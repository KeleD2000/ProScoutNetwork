import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  fileUpload(data: FormData){
    return this.http.post(`${this.baseUrl}/api/upload`, data);
  }
}
