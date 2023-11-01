import { Component } from '@angular/core';
import { faClock, faMagnifyingGlass, faPerson } from '@fortawesome/free-solid-svg-icons';
import * as AOS from 'aos';

@Component({
  selector: 'app-player-main',
  templateUrl: './player-main.component.html',
  styleUrls: ['./player-main.component.css']
})
export class PlayerMainComponent {
  faSearch = faMagnifyingGlass;
  faPeople = faPerson;
  faC = faClock;

  ngAfterViewInit(){
    AOS.init({
      once: true
    });
   }
}
