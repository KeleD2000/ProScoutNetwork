import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { MainRoutingModule } from './main-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UsComponent } from './us/us.component';



@NgModule({
  declarations: [
    HomeComponent,
    UsComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    FontAwesomeModule
  ]
})
export class MainModule { }
