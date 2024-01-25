import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ScoutAdsService } from 'src/app/services/scout-ads.service';
import { trigger, transition, style, animate } from '@angular/animations';
import * as AOS from 'aos';
import Swal from 'sweetalert2';
import { WebsocketService } from 'src/app/services/websocket.service';
import { NotificationsBidDto } from 'src/app/model/dto/NotificationsBidDto';
import { BidService } from 'src/app/services/bid.service';

@Component({
  selector: 'app-update-scout-ads',
  templateUrl: './update-scout-ads.component.html',
  styleUrls: ['./update-scout-ads.component.css'],
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
export class UpdateScoutAdsComponent {
  selectedFile: File | null = null;
  currentAdId: number = 0;
  errorMessages: string[] = [];
  adsUpdate !: FormGroup
  contentValue: string = '';

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder,
    private scoutAdsService: ScoutAdsService, private router: Router,
    private websocketService: WebsocketService, private bidService: BidService
  ) {
    this.adsUpdate = this.formBuilder.group({
      content: ['']
    })
  }

  modifyAds() {
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


    this.route.params.subscribe(params => {
      this.currentAdId = +params['id'];
      // Itt a this.currentAdId változóban lesz az adott hirdetés azonosítója
      // Használd ezt az azonosítót az adatok betöltéséhez vagy más szükséges műveletekhez
      console.log(this.currentAdId);
    });
    this.scoutAdsService.getAllScoutAds().subscribe(ads => {
      for (const [key, value] of Object.entries(ads)) {
        console.log(value.scoutad_id);
        if (value.scoutad_id === this.currentAdId) {

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
