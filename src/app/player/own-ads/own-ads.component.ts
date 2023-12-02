import { Component } from '@angular/core';
import { faClock, faMagnifyingGlass, faPerson } from '@fortawesome/free-solid-svg-icons';
import * as AOS from 'aos';
import { FileService } from 'src/app/services/file.service';
import { PlayerAdsService } from 'src/app/services/player-ads.service';

@Component({
  selector: 'app-own-ads',
  templateUrl: './own-ads.component.html',
  styleUrls: ['./own-ads.component.css']
})
export class OwnAdsComponent {
  faSearch = faMagnifyingGlass;
  faPeople = faPerson;
  faC = faClock;
  adArray: any[] = [];

  constructor(private fileService: FileService, private playerAdsServices: PlayerAdsService){}

  ngOnInit(){
    const username = localStorage.getItem('isLoggedin');
    const converted = username?.replace(/"/g, '');
  
    this.fileService.getCurrentUser(converted).subscribe(user => {
      for(const [key,value] of Object.entries(user)){
        if(key === 'player'){
          for(const [kk,vv] of Object.entries(value)){
            if(kk === 'playerAds'){
              for(let j in vv as any[]){
                const adObj = {
                  content : '',
                  playerad_id: 0
                }
                adObj.content = (vv as any[])[j].content;
                adObj.playerad_id = (vv as any[])[j].playerad_id;
                this.adArray.push(adObj);
              }
            }
          }
        }
      }
  
      // Itt hívjuk meg a második API-hívást
      this.fetchPlayerAds();
    });
  }
  
  fetchPlayerAds() {
    this.playerAdsServices.getAllPlayerAds().subscribe( ad => {
      for (const [key, value] of Object.entries(ad)) {
        for(let j in this.adArray){
          if(value.playerad_id === this.adArray[j].playerad_id){
            const listAdObj = {
              
            }
          }
        }
      }
    });
  }
  
  
  ngAfterViewInit(){
    AOS.init({
      once: true
    });
   }
}
