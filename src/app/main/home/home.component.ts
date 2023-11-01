import { Component } from '@angular/core';
import * as AOS from 'aos';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  ngOnInit() {

 }

 ngAfterViewInit(){
  AOS.init({
    once: true
  });
 }

}
