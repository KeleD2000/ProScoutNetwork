import { Component } from '@angular/core';
import { faClock, faMagnifyingGlass, faMedal, faPeopleGroup, faPerson } from '@fortawesome/free-solid-svg-icons';
import * as AOS from 'aos';
import { FileService } from 'src/app/services/file.service';
import { PlayerAdsService } from 'src/app/services/player-ads.service';
import { ScoutAdsService } from 'src/app/services/scout-ads.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-player-main',
  templateUrl: './player-main.component.html',
  styleUrls: ['./player-main.component.css']
})
export class PlayerMainComponent {
  faSearch = faMagnifyingGlass;
  faPeople = faPerson;
  faC = faClock;
  faTeam = faPeopleGroup;
  faSport = faMedal;
  ownAds: boolean = false;
  scoutAllAds: any[] = [];
  content = '';
  selectedFile: File | null = null;

  constructor(private playerAdsService: PlayerAdsService, private fileService: FileService, 
    private userService: UserService, private scoutAdsService: ScoutAdsService) {}

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
      this.playerAdsService.fileAdsUpload(data, converted).subscribe(p => {
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
        if(key === 'player'){
          for(let i in value){
            console.log(value.playerAds);
            if(value.playerAds.length > 0){
              this.ownAds = true;
            }
            for(let j in value.playerAds){
              console.log(value.playerAds[j]);
            }
          }
        }
      }
    });

    this.userService.getAllScout().subscribe(scout => {
      for (const [key, value] of Object.entries(scout)) {
        console.log(key, value);
        
        const scoutAds = [];
    
        for (let i in value.scoutAds) {
          const scoutAdObj = {
            name: value.last_name + " " + value.first_name,
            sport: value.sport,
            team: value.team,
            hasAd: true,
            content: value.scoutAds[i].content,
            image: '',
            ad_id: value.scoutAds[i].scoutad_id
          };
    
          this.scoutAdsService.getAdsPic(scoutAdObj.ad_id).subscribe(
            (response: any) => {
              if (response) {
                const reader = new FileReader();
                reader.onload = () => {
                  scoutAdObj.image = reader.result as string;
                };
                reader.readAsDataURL(new Blob([response]));
              }
            },
            (error) => {
              console.error('Error fetching ad picture:', error);
            }
          );
          scoutAds.push(scoutAdObj);
        }
    
        if (scoutAds.length > 0) {
          this.scoutAllAds.push(...scoutAds);
          console.log(this.scoutAllAds);
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
