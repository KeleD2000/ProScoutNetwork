import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { faBackward, faClock, faMagnifyingGlass, faMedal, faPeopleGroup, faPerson } from '@fortawesome/free-solid-svg-icons';
import * as AOS from 'aos';
import { FileService } from 'src/app/services/file.service';
import { PlayerAdsService } from 'src/app/services/player-ads.service';
import { ScoutAdsService } from 'src/app/services/scout-ads.service';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/services/user.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { BidDto } from 'src/app/model/dto/BidDto';

@Component({
  selector: 'app-player-main',
  templateUrl: './player-main.component.html',
  styleUrls: ['./player-main.component.css'],
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
export class PlayerMainComponent {
  faSearch = faMagnifyingGlass;
  faPeople = faPerson;
  faC = faClock;
  faTeam = faPeopleGroup;
  faSport = faMedal;
  ownAds: boolean = false;
  scoutAllAds: any[] = [];
  searchScoutAllAds: any[] = [];
  errorMessages: string[] = [];
  searchTerm: string = '';
  isSearched: boolean = false;
  selectedFile: File | null = null;
  faBack = faBackward;
  adsForm: FormGroup

  constructor(private playerAdsService: PlayerAdsService, private fileService: FileService,
    private userService: UserService, private scoutAdsService: ScoutAdsService, private router: Router,
    private formBuilder: FormBuilder, private websocketService: WebsocketService) {
      this.adsForm = this.formBuilder.group({
        content : ['']
      })
     }

  getUserDetails(username: string) {
    this.router.navigate(['/user-details'], { queryParams: { name: username } });
  }

  uploadAds() {
    this.errorMessages = []; 


    if (!this.selectedFile) {
      this.errorMessages.push('Képfeltöltés kötelező!');
      return;
    }

    if (!this.adsForm.get('content')?.value) {
      this.errorMessages.push('A tartalom kitöltése kötelező!');
    }

    if (this.errorMessages.length > 0) {
      
      return;
    }

    const username = localStorage.getItem('isLoggedin');
    const converted = username?.replace(/"/g, '');
    console.log(converted);
    if (converted) {
      const data = new FormData();
      data.append("content", this.adsForm.get('content')?.value);
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
    this.fileService.getCurrentUser(converted).subscribe(user => {
      for (const [key, value] of Object.entries(user)) {
        if (key === 'player') {
          for (let i in value) {
            if (value.playerAds.length > 0) {
              this.ownAds = true;
            }
          }
        }
      }
    });

    this.userService.getAllScout().subscribe(scout => {
      for (const [key, value] of Object.entries(scout)) {
        console.log(key, value.scout);

        const scoutAds = [];
        for (let i in value.scout.scoutAds) {
          const scoutAdObj = {
            id: value.scout.id,
            name: value.scout.last_name + " " + value.scout.first_name,
            username: value.username,
            sport: value.scout.sport,
            team: value.scout.team,
            hasAd: true,
            content: value.scout.scoutAds[i].content,
            image: '',
            ad_id: value.scout.scoutAds[i].scoutad_id
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

  onSubmit() {
    this.scoutAdsService.searchByPlayer(this.searchTerm).subscribe((res) => {
      for (let i in res) {
        const scoutAdsSearch = [];
        console.log(res[i]);
        for (let j in res[i].scoutAds) {
          const playerAdObj = {
            name: res[i].last_name + " " + res[i].first_name,
            team: res[i].team,
            sport: res[i].sport,
            hasAd: true,
            content: res[i].scoutAds[j].content,
            image: '',
            ad_id: res[i].scoutAds[j].scoutad_id
          };
          this.scoutAdsService.getAdsPic(playerAdObj.ad_id).subscribe(
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
          scoutAdsSearch.push(playerAdObj);
        }

        if (scoutAdsSearch.length > 0) {
          this.searchScoutAllAds.push(...scoutAdsSearch);
        }
      }

    });
    this.isSearched = true;
  }

  onBack() {
    window.location.reload();
  }

  ngAfterViewInit() {
    AOS.init({
      once: true
    });
  }
}
