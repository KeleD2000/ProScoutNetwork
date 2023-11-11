import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';


const routes: Routes = [
  {path: '', loadChildren: () => import('./main/main.module').then((m) => m.MainModule)},
  {path: '', loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule)},
  {path: '', loadChildren: () => import('./player/player.module').then((m) => m.PlayerModule)},
  {path: '**', component: NotFoundComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
