import { Component } from '@angular/core';
import * as AOS from 'aos';

@Component({
  selector: 'app-update-ads',
  templateUrl: './update-ads.component.html',
  styleUrls: ['./update-ads.component.css']
})
export class UpdateAdsComponent {

  constructor(){}


  ngAfterViewInit() {
    AOS.init({
      once: true
    });
  }
}
