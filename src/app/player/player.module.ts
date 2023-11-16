import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlayerRoutingModule } from './player-routing.module';
import { PlayerMainComponent } from './player-main/player-main.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PlayerProfileComponent } from './player-profile/player-profile.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PlayerMainComponent,
    PlayerProfileComponent
  ],
  imports: [
    CommonModule,
    PlayerRoutingModule,
    FontAwesomeModule,
    FormsModule
  ]
})
export class PlayerModule { }
