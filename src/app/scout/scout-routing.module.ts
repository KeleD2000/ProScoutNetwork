import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScoutMainComponent } from './scout-main/scout-main.component';
import { ScoutOwnAdsComponent } from './scout-own-ads/scout-own-ads.component';
import { UpdateScoutAdsComponent } from './update-scout-ads/update-scout-ads.component';
import { ScoutProfileComponent } from './scout-profile/scout-profile.component';
import { UpdateScoutProfileComponent } from './update-scout-profile/update-scout-profile.component';
import { ScoutMessagesComponent } from './scout-messages/scout-messages.component';
import { ScoutBidComponent } from './scout-bid/scout-bid.component';

const routes: Routes = [
  {path: 'scout-main', component: ScoutMainComponent},
  {path: 'scout-own-ads', component: ScoutOwnAdsComponent},
  {path: 'update-scout-ads/:id', component: UpdateScoutAdsComponent},
  {path: 'update-scout-profile', component: UpdateScoutProfileComponent},
  {path: 'scout-profile', component: ScoutProfileComponent},
  {path: 'scout-message', component: ScoutMessagesComponent},
  {path: 'scout-bid', component: ScoutBidComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScoutRoutingModule { }
