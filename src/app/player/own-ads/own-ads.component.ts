import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faClock, faMagnifyingGlass, faPerson } from '@fortawesome/free-solid-svg-icons';
import * as AOS from 'aos';
import Swal from 'sweetalert2';
import { FileService } from 'src/app/services/file.service';
import { PlayerAdsService } from 'src/app/services/player-ads.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { BidDto } from 'src/app/model/dto/BidDto';

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
    private route: ActivatedRoute, private websocketService: WebsocketService){}

    ngOnInit() {
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
            icon: 'warning',
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

  deleteAd(adId: number){
    this.playerAdsServices.deleteAds(adId).subscribe( del =>{
      window.location.reload();
      console.log(del);
    })
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
