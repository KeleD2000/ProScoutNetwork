import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as AOS from 'aos';
import Swal from 'sweetalert2';
import { trigger, transition, style, animate } from '@angular/animations';
import { PlayerAdsService } from 'src/app/services/player-ads.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { BidDto } from 'src/app/model/dto/BidDto';

@Component({
  selector: 'app-update-ads',
  templateUrl: './update-ads.component.html',
  styleUrls: ['./update-ads.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class UpdateAdsComponent {
  selectedFile: File | null = null;
  currentAdId: number = 0;
  errorMessages: string[] = [];
  adsUpdate !: FormGroup
  contentValue: string = '';

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private playerAdsService: PlayerAdsService, private router: Router, private websocketService: WebsocketService){
    this.adsUpdate = this.formBuilder.group({
      content : ['']
    })
  }

  modifyAds(){
    this.errorMessages = []; 

    if (!this.selectedFile) {
      this.errorMessages.push('Képfeltöltés kötelező!');
      return;
    }

    if (!this.adsUpdate.get('content')?.value) {
      this.errorMessages.push('A tartalom kitöltése kötelező!');
    }

    if (this.errorMessages.length > 0) {
      
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
    this.websocketService.initializeWebSocketConnection();

    this.websocketService.getBids().subscribe((bid: BidDto) => {
      console.log(bid);
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success m-1',
          cancelButton: 'btn btn-danger m-1',
        },
        buttonsStyling: false,
      });
      
      swalWithBootstrapButtons
        .fire({
          title: `Ajánlat értesítés ${bid.senderUsername} felhasználótól.`,
          text: `Ez az ajánlata: ${bid.bid_content}, ez az összeg amit ajánl: ${bid.offer}`,
          showCancelButton: true,
          confirmButtonText: 'Elfogadom!',
          cancelButtonText: 'Nem fogadom el!',
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            swalWithBootstrapButtons.fire({
              title: 'Elfogadtad a ajánlatot',
              text: 'Sikeresen elfogadtad a ajánlatot, profil oldalon megfog jeleni az ajánlat amit elfogadtál.',
              icon: 'success',
            });
          } else if (
            result.dismiss === Swal.DismissReason.cancel
          ) {
            swalWithBootstrapButtons.fire({
              title: 'Nem fogadtad el a licitálást.',
              text: 'Nem éltél a licitálás lehetőségével.',
              icon: 'error',
            });
          }
        });
    });


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
