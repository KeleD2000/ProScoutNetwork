import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UpdatePlayer } from '../model/UpdatePlayer';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  updatePlayer(updateData: UpdatePlayer){
    return this.http.patch(`${this.baseUrl}/api/update_profile`, updateData);
  }

  deletePlayer(username: any){
    return this.http.delete(`${this.baseUrl}/api/delete_player_profile/${username}`);
  }

}
