import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayerMainComponent } from './player-main/player-main.component';

const routes: Routes = [
  {path: 'player-main', component:PlayerMainComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlayerRoutingModule { }
