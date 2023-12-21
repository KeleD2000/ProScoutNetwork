import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScoutMainComponent } from './scout-main/scout-main.component';
import { ScoutOwnAdsComponent } from './scout-own-ads/scout-own-ads.component';
import { UpdateScoutAdsComponent } from './update-scout-ads/update-scout-ads.component';
import { UpdateProfileComponent } from '../player/update-profile/update-profile.component';
import { ScoutProfileComponent } from './scout-profile/scout-profile.component';

const routes: Routes = [
  {path: 'scout-main', component: ScoutMainComponent},
  {path: 'scout-own-ads', component: ScoutOwnAdsComponent},
  {path: 'update-scout-ads/:id', component: UpdateScoutAdsComponent},
  {path: 'update-scout-profile', component: UpdateProfileComponent},
  {path: 'scout-profile', component: ScoutProfileComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScoutRoutingModule { }
