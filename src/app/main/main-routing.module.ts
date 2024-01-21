import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UsComponent } from './us/us.component';
import { StaticsComponent } from './statics/statics.component';


@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: HomeComponent },
    { path: 'us', component: UsComponent },
    { path: 'statics', component: StaticsComponent }
  ])],
  exports: [RouterModule]
})
export class MainRoutingModule { }
