import { Component, Renderer2 } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { trigger, transition, style, animate } from '@angular/animations';
import * as AOS from 'aos';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FileService } from 'src/app/services/file.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  pdf_filename: string = '';
  profileDetails: any[] = [];
  selectedFile?: File;
  image: any;
  isItPlayer: boolean = false;
  isItScout: boolean = false;
  videoFileId: number = 0;
  selectedPlatform: string = '';
  videoUrl?: SafeResourceUrl;

  constructor(private renderer: Renderer2, private fileService: FileService,
    private sanitizer: DomSanitizer, private userSerivce: UserService,
    private router: Router, private route: ActivatedRoute
  ) {

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
      case 'files':
        this.modalTitle = 'Fájlok';
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
        console.log(this.videoUrl);
      },
      error => {
        console.error('Hiba a videó letöltésekor', error);
      }
    );

  }

  ngOnInit() {
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
        if(key === 'roles'){
          if(value === 'PLAYER'){
            this.isItPlayer = true;
          }
          if(value === 'SCOUT'){
            this.isItScout = true;
          }

        }
        if (key === 'scout' && value) {
          profilObj.name = value.last_name + ' ' + value.first_name;
          profilObj.email = value.email;
          profilObj.sport = value.sport;
          profilObj.team = value.team;

        }else if (key === 'player' && value) {
          profilObj.name = value.last_name + ' ' + value.first_name;
          profilObj.email = value.email;
          profilObj.location = value.location;
          profilObj.sport = value.sport;
          profilObj.pos = value.position;
          profilObj.age = value.age;
        }
        
        if (key === 'files') {
          console.log(value);
          for (let i in value) {
            console.log(value[i]);
            if (value[i].type === 'pdf') {
              console.log(value[i].files_id);
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
    });
    console.log(this.profileDetails);
    console.log(this.pdf_filename);
  }

  ngAfterViewInit() {
    AOS.init({
      once: true
    });
  }
}
