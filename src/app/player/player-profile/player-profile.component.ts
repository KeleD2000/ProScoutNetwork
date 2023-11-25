import { Component, Renderer2 } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import * as AOS from 'aos';
import { FileService } from 'src/app/services/file.service';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-player-profile',
  templateUrl: './player-profile.component.html',
  styleUrls: ['./player-profile.component.css'],
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
export class PlayerProfileComponent {
  showModal: boolean = false;
  modalTitle: string = '';
  selectedOption: string = '';
  input1Value: string = '';
  input2Value: string = '';
  input3Value: string = '';
  username: string = '';
  profileDetails: any[] = [];
  selectedFile?: File;
  image: any;
  fileId: number = 0;
  videoFileId: number = 0;
  selectedPlatform: string = '';
  videoUrl?: SafeResourceUrl;
  faDelete = faTrash;

  constructor(private renderer: Renderer2, private fileService: FileService, private sanitizer: DomSanitizer) {

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
      a.download = 'filename.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    });
  }


  uploadPdfFile() {
    if (!this.selectedFile) {
      return;
    }
    const username = localStorage.getItem('isLoggedin');
    if (username) {
      const data = new FormData();
      data.append("file", this.selectedFile, this.selectedFile.name);
      data.append("type", 'pdf');
      data.append("format", this.selectedFile.type);
      data.append("username", JSON.parse(username));
      this.fileService.pdfFileUpload(data).subscribe(p => {
        console.log(p, "Sikeres");
        window.location.reload();
      })
    }
  }

  uploadVideoFile() {
    if (!this.selectedFile) {
      return;
    }
    const username = localStorage.getItem('isLoggedin');
    if (username) {
      const data = new FormData();
      data.append("file", this.selectedFile, this.selectedFile.name);
      data.append("type", this.selectedOption);
      data.append("format", this.selectedFile.type);
      data.append("username", JSON.parse(username));
      this.fileService.videoFileUpload(data).subscribe(p => {
        console.log(p, "Sikeres");
        window.location.reload();
      })
    }
  }

  uploadProfilpicFile() {
    if (!this.selectedFile) {
      return;
    }
    const username = localStorage.getItem('isLoggedin');
    if (username) {
      const data = new FormData();
      data.append("file", this.selectedFile, this.selectedFile.name);
      data.append("type", this.selectedOption);
      data.append("format", this.selectedFile.type);
      data.append("username", JSON.parse(username));
      this.fileService.fileUpload(data).subscribe(p => {
        console.log(p, "Sikeres");
        window.location.reload();
      })
    }
  }

  deleteProfilePic() {
    const username = localStorage.getItem('isLoggedin');
    let current = username?.replace(/"/g, '');
    this.fileService.deleteProfilPic(current).subscribe(response => {
      console.log(response);
      window.location.reload();
    },
      error => {
        console.error(error);
      }
    );
  }

  downloadVideo(fileId: number){
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
    const username = localStorage.getItem('isLoggedin');
    let current = username?.replace(/"/g, '');
    console.log(current);

    this.fileService.getProfilePicBlob(current).subscribe(
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

    this.fileService.getCurrentUser(current).subscribe(user => {
      console.log(user);
      const profilObj = {
        name: '',
        email: '',
        location: '',
        sport: '',
        pos: '',
        pdf_file_id: 0,
        pic_file_id: 0,
        video_file_id: 0,
      };
      for (const [key, value] of Object.entries(user)) {
        if (key === 'player') {
          profilObj.name = value.last_name + ' ' + value.first_name;
          profilObj.email = value.email;
          profilObj.location = value.location;
          profilObj.sport = value.sport;
          profilObj.pos = value.position;
    
          for (let i in value.files) {
            if (value.files[i].type === 'pdf') {
              profilObj.pdf_file_id = value.files[i].files_id;
            }
            if (value.files[i].type === 'video') {
              profilObj.video_file_id = value.files[i].files_id;
            }
            if (value.files[i].type === 'profilpic') {
              profilObj.pic_file_id = value.files[i].files_id;
            }
          }
        }
      }
      this.fileId = profilObj.pdf_file_id;
      this.videoFileId = profilObj.video_file_id;
      this.profileDetails.push(profilObj);
    });
    console.log(this.profileDetails);
  }

  ngAfterViewInit() {
    AOS.init({
      once: true
    });
  }
}
