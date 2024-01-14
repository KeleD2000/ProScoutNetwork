import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayerMainComponent } from './player-main/player-main.component';
import { PlayerProfileComponent } from './player-profile/player-profile.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { UpdateAdsComponent } from './update-ads/update-ads.component';
import { OwnAdsComponent } from './own-ads/own-ads.component';
import { PlayerMessagesComponent } from './player-messages/player-messages.component';
import { PlayerBidComponent } from './player-bid/player-bid.component';

const routes: Routes = [
  {path: 'player-main', component:PlayerMainComponent},
  {path: 'player-profile', component:PlayerProfileComponent},
  {path: 'update-profile', component: UpdateProfileComponent},
  {path: 'update-ads/:id', component: UpdateAdsComponent},
  {path: 'own-ads', component:OwnAdsComponent},
  {path: 'player-message', component: PlayerMessagesComponent},
  {path: 'player-bid', component: PlayerBidComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlayerRoutingModule { }
