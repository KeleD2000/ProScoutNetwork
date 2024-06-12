import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { faBackward, faClock, faLocationPin, faMagnifyingGlass, faMedal, faPerson } from '@fortawesome/free-solid-svg-icons';
import * as AOS from 'aos';
import { trigger, transition, style, animate } from '@angular/animations';
import { NotificationsBidDto } from 'src/app/model/dto/NotificationsBidDto';
import { BidService } from 'src/app/services/bid.service';
import { FileService } from 'src/app/services/file.service';
import { PlayerAdsService } from 'src/app/services/player-ads.service';
import { ScoutAdsService } from 'src/app/services/scout-ads.service';
import { UserService } from 'src/app/services/user.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-scout-main',
  templateUrl: './scout-main.component.html',
  styleUrls: ['./scout-main.component.css'],
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
export class ScoutMainComponent {
  faSearch = faMagnifyingGlass;
  faPeople = faPerson;
  faC = faClock;
  faPosition = faLocationPin;
  faSport = faMedal;
  faBack = faBackward;
  playerAllAds: any[] = [];
  searchPlayerAllAds: any[] = [];
  errorMessages: string[] = [];
  ownAds: boolean = false;
  searchTerm: string = '';
  selectedFile: File | null = null;
  isSearched: boolean = false;
  isError: boolean = false;
  errorMessage: string = '';
  adsForm: FormGroup

  constructor(private scoutAdsService: ScoutAdsService, private fileService: FileService,
    private playerAdsService: PlayerAdsService, private userService: UserService, private router: Router, 
    private formBuilder: FormBuilder, private websocketService: WebsocketService, private bidService: BidService) {
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
      this.scoutAdsService.fileAdsUpload(data, converted).subscribe(p => {
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

    this.websocketService.getNotifications().subscribe((not: NotificationsBidDto) => {
      console.log(not);
      const queryParams = {
        senderId: not.senderId,
        senderUsername: not.senderUsername
      };
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
            this.router.navigate(['/scout-bid'], {queryParams});
            localStorage.setItem('isBid', JSON.stringify(true));
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
        if (key === 'scout') {
          for (let i in value) {
            if (value.scoutAds.length > 0) {
              this.ownAds = true;
            }
          }
        }
      }
    });


    this.userService.getAllPlayer().subscribe(players => {
      for (const [key, value] of Object.entries(players)) {
        const playerAds = [];

        for (let i in value.player.playerAds) {
          const playerAdObj = {
            name: value.player.last_name + " " + value.player.first_name,
            username: value.username,
            position: value.player.position,
            age: value.player.age,
            location: value.player.location,
            sport: value.player.sport,
            hasAd: true,
            content: value.player.playerAds[i].content,
            image: '',
            ad_id: value.player.playerAds[i].playerad_id
          };

          this.playerAdsService.getAdsPic(playerAdObj.ad_id).subscribe(
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
          playerAds.push(playerAdObj);
        }

        if (playerAds.length > 0) {
          this.playerAllAds.push(...playerAds);
        }
      }
    });
  }

  onSubmit() {
    this.scoutAdsService.searchByScout(this.searchTerm).subscribe((res) => {
      for (let i in res) {
        const playerAdsSearch = [];
        console.log(res[i]);
        for (let j in res[i].playerAds) {
          console.log(res[i].playerAds[j]);
          const playerAdObj = {
            name: res[i].last_name + " " + res[i].first_name,
            position: res[i].position,
            age: res[i].age,
            location: res[i].location,
            sport: res[i].sport,
            hasAd: true,
            content: res[i].playerAds[j].content,
            image: '',
            ad_id: res[i].playerAds[j].playerad_id
          };
          this.playerAdsService.getAdsPic(playerAdObj.ad_id).subscribe(
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
          playerAdsSearch.push(playerAdObj);
        }

        if (playerAdsSearch.length > 0) {
          this.searchPlayerAllAds.push(...playerAdsSearch);
        }
      }

    }, (error) => {
      console.log(error);
      if(error.status === 400){
        this.isError = true;
        this.errorMessage = error.error.message;
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

