import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  currentUsername : string = '';
  image: any;
  adArray: any[] = [];
  currentAdId: number = 0;
  ownAds: any[] = [];

  constructor(private fileService: FileService, private playerAdsServices: PlayerAdsService, private router: Router,
    private route: ActivatedRoute){}

    ngOnInit() {
      const username = localStorage.getItem('isLoggedin');
      const converted = username?.replace(/"/g, '');
      if (converted) {
        this.currentUsername = converted;
      }
  
      this.fileService.getCurrentUser(converted).subscribe(user => {
        for (const [key, value] of Object.entries(user)) {
          if (key === 'player') {
            for (const [kk, vv] of Object.entries(value)) {
              if (kk === 'playerAds') {
                for (let j in vv as any[]) {
                  const adObj = {
                    content: '',
                    playerad_id: 0,
                  };
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
            console.log(value);
            const listAdObj = {
              content : '',
              playerad_id: 0,
              image :'',
              navigateToUpdatePage: () => this.router.navigate(['/update-ads', listAdObj.playerad_id])
            }
            listAdObj.content = value.content;
            listAdObj.playerad_id = value.playerad_id;

            this.playerAdsServices.getAdsPic(listAdObj.playerad_id).subscribe(
              (response: any) => {
                if (response) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    listAdObj.image = reader.result as string;
                  };
                  reader.readAsDataURL(new Blob([response]));
                }
              },
              (error) => {
                console.error('Error fetching profile picture:', error);
              }
            );
              this.ownAds.push(listAdObj);
              console.log(this.ownAds);
          }
        }
      }
    });
  }

  navigateToUpdatePage(playerad_id: number) {
    // A hirdetés azonosítójának átadása az URL-nek
    this.router.navigate(['/update-ads', playerad_id]);
    console.log(playerad_id);
  }
  
  
  ngAfterViewInit(){
    AOS.init({
      once: true
    });
   }
}
