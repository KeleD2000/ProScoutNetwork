import { Component } from '@angular/core';
import { faClock,faLocationPin, faMagnifyingGlass, faMedal, faPeopleGroup, faPerson } from '@fortawesome/free-solid-svg-icons';
import * as AOS from 'aos';
import { FileService } from 'src/app/services/file.service';
import { PlayerAdsService } from 'src/app/services/player-ads.service';
import { ScoutAdsService } from 'src/app/services/scout-ads.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-scout-main',
  templateUrl: './scout-main.component.html',
  styleUrls: ['./scout-main.component.css']
})
export class ScoutMainComponent {
  faSearch = faMagnifyingGlass;
  faPeople = faPerson;
  faC = faClock;
  faPosition = faLocationPin;
  faSport = faMedal;
  playerAllAds: any[] = [];
  ownAds: boolean = false;
  content = '';
  selectedFile: File | null = null;

  constructor(private scoutAdsService: ScoutAdsService, private fileService: FileService, 
    private playerAdsService: PlayerAdsService, private userService: UserService) {}

  uploadAds() {
    if (!this.selectedFile) {
      return;
    }
    const username = localStorage.getItem('isLoggedin');
    const converted = username?.replace(/"/g, '');
    console.log(converted);
    if (converted) {
      const data = new FormData();
      data.append("content", this.content);
      data.append("file", this.selectedFile, this.selectedFile.name);
      this.scoutAdsService.fileAdsUpload(data, converted).subscribe(p => {
        console.log(p, "Sikeres");
        window.location.reload();
      })
    }
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  ngOnInit(){
    const username = localStorage.getItem('isLoggedin');
    const converted = username?.replace(/"/g, '');
    this.fileService.getCurrentUser(converted).subscribe( user => {
      for(const [key, value] of Object.entries(user)){
        if(key === 'scout'){
          for(let i in value){
            if(value.scoutAds.length > 0){
              this.ownAds = true;
            }
          }
        }
      }
    });


    this.userService.getAllPlayer().subscribe(players => {
      for (const [key, value] of Object.entries(players)) {
        console.log(key, value);
        
        const playerAds = [];
    
        for (let i in value.playerAds) {
          const playerAdObj = {
            name: value.last_name + " " + value.first_name,
            position: value.position,
            age: value.age,
            location: value.location,
            sport: value.sport,
            hasAd: true,
            content: value.playerAds[i].content,
            image: '',
            ad_id: value.playerAds[i].playerad_id
          };
    
          this.playerAdsService.getAdsPic(playerAdObj.ad_id).subscribe(
            (response: any) => {
              if (response) {
                const reader = new FileReader();
                reader.onload = () => {
                  playerAdObj.image = reader.result as string;
                };
                reader.readAsDataURL(new Blob([response]));
              }
            },
            (error) => {
              console.error('Error fetching ad picture:', error);
            }
          );
          playerAds.push(playerAdObj);
        }
    
        if (playerAds.length > 0) {
          this.playerAllAds.push(...playerAds);
          console.log(this.playerAllAds);
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

