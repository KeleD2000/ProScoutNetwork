import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as AOS from 'aos';
import { FileService } from 'src/app/services/file.service';
import { PlayerAdsService } from 'src/app/services/player-ads.service';

@Component({
  selector: 'app-update-ads',
  templateUrl: './update-ads.component.html',
  styleUrls: ['./update-ads.component.css']
})
export class UpdateAdsComponent {
  selectedFile: File | null = null;
  currentAdId: number = 0;
  adsUpdate !: FormGroup
  contentValue: string = '';

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private playerAdsService: PlayerAdsService, private router: Router){
    this.adsUpdate = this.formBuilder.group({
      content : ['']
    })
  }

  modifyAds(){
    if (!this.selectedFile){
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('content', this.adsUpdate.get('content')?.value);

    this.playerAdsService.modifyAds(formData, this.currentAdId).subscribe(
        (response) => {
            this.router.navigateByUrl("/own-ads");
            console.log(response);
        },
        (error) => {
            // Hibakezelés
            console.error(error);
        }
    );
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  ngOnInit(){
    this.route.params.subscribe(params => {
      this.currentAdId = +params['id'];
      // Itt a this.currentAdId változóban lesz az adott hirdetés azonosítója
      // Használd ezt az azonosítót az adatok betöltéséhez vagy más szükséges műveletekhez
      console.log(this.currentAdId);
  });
  this.playerAdsService.getAllPlayerAds().subscribe( ads =>{
    for(const [key, value] of Object.entries(ads)){
      console.log(value.playerad_id);
      if(value.playerad_id === this.currentAdId){

        this.contentValue = value.content;
        console.log(this.contentValue);
      }
    }
  })
}



  ngAfterViewInit() {
    AOS.init({
      once: true
    });
  }
}
