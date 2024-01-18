import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faClock, faLocationPin, faMagnifyingGlass, faMedal, faPerson } from '@fortawesome/free-solid-svg-icons';
import * as AOS from 'aos';
import { NotificationsBidDto } from 'src/app/model/dto/NotificationsBidDto';
import { BidService } from 'src/app/services/bid.service';
import { FileService } from 'src/app/services/file.service';
import { ScoutAdsService } from 'src/app/services/scout-ads.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-scout-own-ads',
  templateUrl: './scout-own-ads.component.html',
  styleUrls: ['./scout-own-ads.component.css']
})
export class ScoutOwnAdsComponent {
  faPeople = faPerson;
  currentUsername : string = '';
  image: any;
  adArray: any[] = [];
  currentAdId: number = 0;
  ownAds: any[] = [];

  constructor(private fileService: FileService, private scoutAdService: ScoutAdsService, private router: Router,
    private route: ActivatedRoute, private websocketService: WebsocketService, private bidService: BidService){}

    ngOnInit() {
      this.websocketService.initializeWebSocketConnection();

      this.websocketService.getNotifications().subscribe((not: NotificationsBidDto) => {
        console.log(not);
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: 'btn btn-success m-1',
            cancelButton: 'btn btn-danger m-1',
          },
          buttonsStyling: false,
        });
        
        swalWithBootstrapButtons
          .fire({
            title: 'Licitálás értesítés',
            text: not.message,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Elfogadom!',
            cancelButtonText: 'Nem fogadom el!',
            reverseButtons: true,
          })
          .then((result) => {
            if (result.isConfirmed) {
              swalWithBootstrapButtons.fire({
                title: 'Elfogadtad a licitálást',
                text: 'Sikeresen elfogadtad a licitálást, átnavigálunk a licitáló felületre.',
                icon: 'success',
              });
              this.router.navigate(['/scout-bid']);
              localStorage.setItem('isBid', JSON.stringify(true));
              const usernamePlayer = localStorage.getItem('isLoggedin');
              var current = usernamePlayer?.replace(/"/g, '');
              if(current){
                this.bidService.connectUser(current).subscribe(
                  (response: any) => {
                    console.log('Sikeres csatlakozás', response.message);
                  },
                  (error) => {
                    console.error('Hiba történt a csatlakozás során', error.error);
                  }
                );
              }
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
          if (key === 'scout') {
            for (const [kk, vv] of Object.entries(value)) {
              if (kk === 'scoutAds') {
                for (let j in vv as any[]) {
                  const adObj = {
                    content: '',
                    scoutad_id: 0,
                  };
                  adObj.content = (vv as any[])[j].content;
                  adObj.scoutad_id = (vv as any[])[j].scoutad_id;
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
    this.scoutAdService.getAllScoutAds().subscribe( ad => {
      for (const [key, value] of Object.entries(ad)) {
        for(let j in this.adArray){
          if(value.scoutad_id === this.adArray[j].scoutad_id){
            console.log(value);
            const listAdObj = {
              content : '',
              scoutad_id: 0,
              image :'',
              navigateToUpdatePage: () => this.router.navigate(['/update-ads', listAdObj.scoutad_id])
            }
            listAdObj.content = value.content;
            listAdObj.scoutad_id = value.scoutad_id;

            this.scoutAdService.getAdsPic(listAdObj.scoutad_id).subscribe(
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
    this.scoutAdService.deleteAds(adId).subscribe( del =>{
      window.location.reload();
      console.log(del);
    })
  }

  navigateToUpdatePage(scoutad_id: number) {
    this.router.navigate(['/update-scout-ads', scoutad_id]);
    console.log(scoutad_id);
  }
  
  
  ngAfterViewInit(){
    AOS.init({
      once: true
    });
   }
}
