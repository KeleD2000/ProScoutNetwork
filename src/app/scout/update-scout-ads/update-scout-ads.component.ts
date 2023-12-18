import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ScoutAdsService } from 'src/app/services/scout-ads.service';
import * as AOS from 'aos';

@Component({
  selector: 'app-update-scout-ads',
  templateUrl: './update-scout-ads.component.html',
  styleUrls: ['./update-scout-ads.component.css']
})
export class UpdateScoutAdsComponent {
  selectedFile: File | null = null;
  currentAdId: number = 0;
  adsUpdate !: FormGroup
  contentValue: string = '';

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private scoutAdsService: ScoutAdsService, private router: Router){
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

    this.scoutAdsService.modifyAds(formData, this.currentAdId).subscribe(
        (response) => {
            this.router.navigateByUrl("/scout-own-ads");
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
  this.scoutAdsService.getAllScoutAds().subscribe( ads =>{
    for(const [key, value] of Object.entries(ads)){
      console.log(value.scoutad_id);
      if(value.scoutad_id === this.currentAdId){

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
