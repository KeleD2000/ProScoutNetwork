import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayerMainComponent } from './player-main/player-main.component';
import { PlayerProfileComponent } from './player-profile/player-profile.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';

const routes: Routes = [
  {path: 'player-main', component:PlayerMainComponent},
  {path: 'player-profile', component:PlayerProfileComponent},
  {path: 'update-profile', component: UpdateProfileComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlayerRoutingModule { }
