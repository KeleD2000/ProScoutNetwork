import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlayerRoutingModule } from './player-routing.module';
import { PlayerMainComponent } from './player-main/player-main.component';


@NgModule({
  declarations: [
    PlayerMainComponent
  ],
  imports: [
    CommonModule,
    PlayerRoutingModule,
  ]
})
export class PlayerModule { }
