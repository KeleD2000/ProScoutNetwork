import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UpdatePlayer } from '../model/UpdatePlayer';
import { UpdateScout } from '../model/UpdateScout';

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

  updateScout(updateData: UpdateScout){
    return this.http.patch(`${this.baseUrl}/api/update_scout`, updateData);
  }  

  deleteScout(username: any){
    return this.http.delete(`${this.baseUrl}/api/delete_scout_profile/${username}`);
  }

  getAllPlayer(){
    return this.http.get(`${this.baseUrl}/api/players`);
  }

  getAllScout(){
    return this.http.get(`${this.baseUrl}/api/scouts`);
  }

}
