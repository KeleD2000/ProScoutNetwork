import { Component } from '@angular/core';
import * as AOS from 'aos';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {

  ngOnInit(){

  }

  ngAfterViewInit(){
    AOS.init({
      once: true
    });
   }

}
