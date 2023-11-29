import { Component } from '@angular/core';
import { faClock, faMagnifyingGlass, faPerson } from '@fortawesome/free-solid-svg-icons';
import * as AOS from 'aos';
import { FileService } from 'src/app/services/file.service';
import { PlayerAdsService } from 'src/app/services/player-ads.service';

@Component({
  selector: 'app-player-main',
  templateUrl: './player-main.component.html',
  styleUrls: ['./player-main.component.css']
})
export class PlayerMainComponent {
  faSearch = faMagnifyingGlass;
  faPeople = faPerson;
  faC = faClock;
  ownAds: boolean = false;
  content = '';
  selectedFile: File | null = null;

  constructor(private playerAdsService: PlayerAdsService, private fileService: FileService) {}

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
    })
  }

  ngAfterViewInit(){
    AOS.init({
      once: true
    });
   }
}
