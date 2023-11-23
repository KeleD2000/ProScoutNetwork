import { Component, Renderer2 } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import * as AOS from 'aos';
import { FileService } from 'src/app/services/file.service';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

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
  selectedFile?: File;
  image: any;
  fileId = 2;
  faDelete = faTrash;

  constructor(private renderer: Renderer2, private fileService: FileService) {

  }

  openModal(platform: string) {
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
    }

    // A popup tartalom és cím beállítása
    const modalTitleElement = document.querySelector('.modal-title');
    const modalBody = document.querySelector('.modal-body');
    if (modalTitleElement && modalBody) {
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


  }

  ngAfterViewInit() {
    AOS.init({
      once: true
    });
  }
}
