import { Component } from '@angular/core';
import { faCheckToSlot } from '@fortawesome/free-solid-svg-icons';
import * as AOS from 'aos';

@Component({
  selector: 'app-us',
  templateUrl: './us.component.html',
  styleUrls: ['./us.component.css']
})
export class UsComponent {
  faCheckPipe = faCheckToSlot;

  ngAfterViewInit(){
    AOS.init({
      once: true
    });
   }

}
