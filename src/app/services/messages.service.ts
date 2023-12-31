import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileService } from './file.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getSenders(receiverId: number): Observable<any>{
    return this.http.get(`${this.baseUrl}/api/messages/latest/` + receiverId);
  }

  getMessages(senderId: number, receiverId: number): Observable<any>{
    return this.http.get(`${this.baseUrl}/api/conversation?senderId=`+ senderId + `&receiverId=` + receiverId);
  }

}
