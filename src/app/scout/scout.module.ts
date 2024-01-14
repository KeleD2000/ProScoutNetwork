import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScoutRoutingModule } from './scout-routing.module';
import { ScoutMainComponent } from './scout-main/scout-main.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScoutOwnAdsComponent } from './scout-own-ads/scout-own-ads.component';
import { UpdateScoutAdsComponent } from './update-scout-ads/update-scout-ads.component';
import { UpdateScoutProfileComponent } from './update-scout-profile/update-scout-profile.component';
import { ScoutMessagesComponent } from './scout-messages/scout-messages.component';
import { ScoutProfileComponent } from './scout-profile/scout-profile.component';
import { ScoutBidComponent } from './scout-bid/scout-bid.component';

@NgModule({
  declarations: [
    ScoutMainComponent,
    ScoutOwnAdsComponent,
    UpdateScoutAdsComponent,
    UpdateScoutProfileComponent,
    ScoutMessagesComponent,
    ScoutProfileComponent,
    ScoutBidComponent
  ],
  imports: [
    CommonModule,
    ScoutRoutingModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ScoutModule { }
