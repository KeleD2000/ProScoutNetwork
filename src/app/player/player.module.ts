import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlayerRoutingModule } from './player-routing.module';
import { PlayerMainComponent } from './player-main/player-main.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PlayerProfileComponent } from './player-profile/player-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdateProfileComponent } from './update-profile/update-profile.component';


@NgModule({
  declarations: [
    PlayerMainComponent,
    PlayerProfileComponent,
    UpdateProfileComponent
  ],
  imports: [
    CommonModule,
    PlayerRoutingModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PlayerModule { }
