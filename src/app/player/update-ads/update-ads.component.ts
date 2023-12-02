import { Component } from '@angular/core';
import * as AOS from 'aos';
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'app-update-ads',
  templateUrl: './update-ads.component.html',
  styleUrls: ['./update-ads.component.css']
})
export class UpdateAdsComponent {
  selectedFile: File | null = null;

  constructor(private fileService: FileService){}

  modifyAds(){
    if (!this.selectedFile){
      return;
    }
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  ngOnInit(){
    const username = localStorage.getItem('isLoggedin');
    const converted = username?.replace(/"/g, '');
    this.fileService.getCurrentUser(converted).subscribe(user => {
      for(const [key,value] of Object.entries(user)){
        if(key === 'player'){
          for(const [kk,vv] of Object.entries(value)){
            if(kk === 'playerAds'){
              console.log(vv);
              for(let j in vv as any[]){
                console.log((vv as any[])[j]);
              }
            }
          }
        }
      }
    });
  }


  ngAfterViewInit() {
    AOS.init({
      once: true
    });
  }
}
