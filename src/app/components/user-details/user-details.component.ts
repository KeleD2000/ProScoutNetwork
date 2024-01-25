import { Component, Renderer2 } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { trigger, transition, style, animate } from '@angular/animations';
import * as AOS from 'aos';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FileService } from 'src/app/services/file.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsBidDto } from 'src/app/model/dto/NotificationsBidDto';
import { WebsocketService } from 'src/app/services/websocket.service';
import Swal from 'sweetalert2';
import { ReportDto } from 'src/app/model/dto/ReportDto';
import { BidDto } from 'src/app/model/dto/BidDto';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css'],
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
export class UserDetailsComponent {
  showModal: boolean = false;
  modalTitle: string = '';
  selectedOption: string = '';
  input1Value: string = '';
  input2Value: string = '';
  input3Value: string = '';
  username: string = '';
  id: number = 0;
  pdf_filename: string = '';
  profileDetails: any[] = [];
  selectedFile?: File;
  image: any;
  notSenderId: number = 0;
  notSenderUsername: string = '';
  isItPlayer: boolean = false;
  isItScout: boolean = false;
  theSearcherIsScout: boolean = false;
  theSearcherIsPlayer: boolean = false;
  reportSenderId: number = 0;
  reportSenderUsername: string = '';
  videoFileId: number = 0;
  selectedPlatform: string = '';
  reportName: string = '';
  videoUrl?: SafeResourceUrl;

  constructor(private renderer: Renderer2, private fileService: FileService,
    private sanitizer: DomSanitizer, private userSerivce: UserService,
    private router: Router, private route: ActivatedRoute, private websocketService: WebsocketService
  ) {

  }

  checkLocalStorageForKey(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  navigateWithParams(username: string, userId: number) {
    if (this.theSearcherIsPlayer) {
      this.router.navigate(['/player-message'], { queryParams: { name: username, id: userId } });
    } else if (this.theSearcherIsScout) {
      this.router.navigate(['/scout-message'], { queryParams: { name: username, id: userId } });
    }
  }

  openModal(platform: string) {
    this.selectedPlatform = platform;
    const modal = document.getElementById('exampleModal');
    if (modal) {
      modal.style.display = 'block';
      modal.classList.add('show');
    }
    this.showModal = true;
    this.renderer.addClass(document.body, 'no-scroll');

    // Az adott platformnak megfelelő tartalom beállítása
    this.modalTitle = '';
    switch (platform) {
      case 'message':
        this.modalTitle = 'Üzenet küldés felhasználónak';
        break;
      case 'videos':
        this.modalTitle = 'Játékos videója';
        this.downloadVideo(this.videoFileId);  // Megjeleníti a videót azonnal
        break;
    }

    // A popup tartalom és cím beállítása
    const modalTitleElement = document.querySelector('.modal-title');
    if (modalTitleElement) {
      modalTitleElement.innerHTML = this.modalTitle;
    }
  }

  closeModal() {
    const modal = document.getElementById('exampleModal');
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('show');
    }
    this.showModal = false;
    this.renderer.removeClass(document.body, 'no-scroll');
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  downloadPdf(fileId: number): void {
    this.fileService.downloadPdf(fileId).subscribe(data => {
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.pdf_filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    });
  }

  downloadVideo(fileId: number) {
    this.fileService.downloadVideo(fileId).subscribe(
      (data: any) => {
        const blob = new Blob([data], { type: 'video/mp4' });
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
      },
      error => {
        console.error('Hiba a videó letöltésekor', error);
      }
    );

  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.reportName = params['name'];

    });

    this.websocketService.initializeWebSocketConnection();

    const keyExistsScout = this.checkLocalStorageForKey('isScout');
    const keyExistsPlayer = this.checkLocalStorageForKey('isPlayer');

    if (keyExistsScout) {
      this.theSearcherIsScout = true;
    } else if (keyExistsPlayer) {
      this.theSearcherIsPlayer = true;
    }

    this.route.queryParams.subscribe(params => {
      this.username = params['name'];
    });

    this.fileService.getProfilePicBlob(this.username).subscribe(
      (response: any) => {
        if (response) {
          const reader = new FileReader();
          reader.onload = () => {
            this.image = reader.result as string;
          };
          reader.readAsDataURL(new Blob([response], { type: 'image/png' }));
        }
      },
      (error) => {
        console.error('Error fetching profile picture:', error);
      }
    );

    this.fileService.getCurrentUser(this.username).subscribe(user => {
      const profilObj = {
        id: 0,
        username: '',
        name: '',
        email: '',
        team: '',
        location: '',
        sport: '',
        age: 0,
        pos: '',
        pdf_file_id: 0,
        pic_file_id: 0,
        video_file_id: 0,
      };


      for (const [key, value] of Object.entries(user)) {
        if (key === 'id') {
          profilObj.id = value;
          this.id = value;
        }
        if (key === 'username') {
          profilObj.username = value;
        }
        if (key === 'roles') {
          if (value === 'PLAYER') {
            this.isItPlayer = true;
          }
          if (value === 'SCOUT') {
            this.isItScout = true;
          }

        }
        if (key === 'scout' && value) {
          profilObj.name = value.last_name + ' ' + value.first_name;
          profilObj.email = value.email;
          profilObj.sport = value.sport;
          profilObj.team = value.team;

        } else if (key === 'player' && value) {
          profilObj.name = value.last_name + ' ' + value.first_name;
          profilObj.email = value.email;
          profilObj.location = value.location;
          profilObj.sport = value.sport;
          profilObj.pos = value.position;
          profilObj.age = value.age;
        }

        if (key === 'files') {
          for (let i in value) {
            if (value[i].type === 'pdf') {

              profilObj.pdf_file_id = value[i].files_id;
              const filePath = value[i].file_path;
              const parts = filePath.split('\\');
              this.pdf_filename = parts[parts.length - 1];
              this.pdf_filename = value[i].file_path.split("'\'").pop();
            }
            if (value[i].type === 'video') {
              profilObj.video_file_id = value[i].files_id;
            }
            if (value[i].type === 'profilpic') {
              profilObj.pic_file_id = value[i].files_id;
            }
          }
        }
      }
      this.videoFileId = profilObj.video_file_id;
      this.profileDetails.push(profilObj);
      console.log(profilObj);
    });
  }

  sendNotification() {
    const username = localStorage.getItem('isLoggedin');
    let currentUser = username?.replace(/"/g, '');
    this.fileService.getCurrentUser(currentUser).subscribe(user => {
      for (const [key, value] of Object.entries(user)) {
        console.log(key, value);
        if (key === 'id') {
          this.notSenderId = value;

        }
        if (key === 'username') {
          this.notSenderUsername = value;

        }
      }
      console.log(this.notSenderId, this.notSenderUsername);
      for (let i in this.profileDetails) {
        var usernameScout = this.profileDetails[i].username;
      }
      const notification: NotificationsBidDto = {
        senderId: this.notSenderId,
        senderUsername: this.notSenderUsername,
        username: usernameScout,
        message: `${currentUser} felhasználó licitálás kedvezményed feléd. Elfogadod?`
      }
      this.websocketService.sendNotification(notification);
      localStorage.setItem('isBid', JSON.stringify(true));
    });
  }

  sendReport(text: string) {
    const username = localStorage.getItem('isLoggedin');
    let currentUser = username?.replace(/"/g, '');
    this.fileService.getCurrentUser(currentUser).subscribe(user => {
      for (const [key, value] of Object.entries(user)) {
        console.log(key, value);
        if (key === 'id') {
          this.reportSenderId = value;

        }
        if (key === 'username') {
          this.reportSenderUsername = value;

        }
      }
      console.log(this.notSenderId, this.notSenderUsername);
      // Az időt most adjuk hozzá, itt azonosítási céllal
      const currentDateTime = new Date();

      const reportToSend: ReportDto = {
        report_content: text,
        timestamp: currentDateTime,
        report_username: this.reportName,
        senderUsername: this.reportSenderUsername,
        receiverUsername: "admin",
        senderUserId: this.reportSenderId,
        receiverUserId: 8,
      };
      console.log(reportToSend);
      this.websocketService.sendReport(reportToSend);
    });
  }

  sendBid(text: string) {
    const username = localStorage.getItem('isLoggedin');
    let currentUser = username?.replace(/"/g, '');
    this.fileService.getCurrentUser(currentUser).subscribe(user => {
      for (const [key, value] of Object.entries(user)) {
        console.log(key, value);
        if (key === 'id') {
          this.reportSenderId = value;

        }
        if (key === 'username') {
          this.reportSenderUsername = value;

        }
      }
      console.log(this.notSenderId, this.notSenderUsername);
      // Az időt most adjuk hozzá, itt azonosítási céllal
      const currentDateTime = new Date();

      const bidToSend: BidDto = {
        bid_content: text,
        timestamp: currentDateTime,
        senderUsername: this.reportSenderUsername,
        receiverUsername: this.username,
        senderUserId: this.reportSenderId,
        receiverUserId: this.id,
      };
      this.websocketService.sendBid(bidToSend);
    });
  }

  async showSweetAlert() {
    const { value: text, isConfirmed } = await Swal.fire({
      input: "textarea",
      inputLabel: `${this.reportName} felhasználó jelentése`,
      inputPlaceholder: "Ide írja a jelentés okát...",
      inputAttributes: {
        "aria-label": "Ide írja a jelentés okát..."
      },
      showCancelButton: true,
      confirmButtonText: 'Küldés',
      cancelButtonText: 'Mégsem',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      didOpen: () => {
        // Az üzenetküldés gomb stílusainak felülírása
        const confirmButton = Swal.getConfirmButton();
        if (confirmButton) {
          confirmButton.style.backgroundColor = '#28a745';
          confirmButton.style.color = '#fff';
          confirmButton.style.marginRight = '5px';
        }

        // A Mégsem gomb stílusainak felülírása
        const cancelButton = Swal.getCancelButton();
        if (cancelButton) {
          cancelButton.style.backgroundColor = '#dc3545';
          cancelButton.style.color = '#fff';
          cancelButton.style.marginLeft = '5px';
        }
      }
    });

    if (isConfirmed && text) {
      this.sendReport(text);
    }
  }

  async showBid() {
    const { value: text, isConfirmed } = await Swal.fire({
      input: "textarea",
      inputLabel: `${this.reportName} felhasználónak ajánlat küldése`,
      inputPlaceholder: "Ide írja az ajánlatát...",
      inputAttributes: {
        "aria-label": "Ide írja az ajánlatát..."
      },
      showCancelButton: true,
      confirmButtonText: 'Küldés',
      cancelButtonText: 'Mégsem',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      didOpen: () => {
        // Az üzenetküldés gomb stílusainak felülírása
        const confirmButton = Swal.getConfirmButton();
        if (confirmButton) {
          confirmButton.style.backgroundColor = '#28a745';
          confirmButton.style.color = '#fff';
          confirmButton.style.marginRight = '5px';
        }

        // A Mégsem gomb stílusainak felülírása
        const cancelButton = Swal.getCancelButton();
        if (cancelButton) {
          cancelButton.style.backgroundColor = '#dc3545';
          cancelButton.style.color = '#fff';
          cancelButton.style.marginLeft = '5px';
        }
      }
    });

    if (isConfirmed && text) {
      this.sendBid(text);
    }
  }

  async ngAfterViewInit() {
    AOS.init({
      once: true
    });
  }
}
