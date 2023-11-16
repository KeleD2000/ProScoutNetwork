import { Component, Renderer2 } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import * as AOS from 'aos';

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

  constructor(private renderer: Renderer2){

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

  ngAfterViewInit(){
    AOS.init({
      once: true
    });
   }
}
