import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { MainModule } from './main/main.module';
import { MainRoutingModule } from './main/main-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PlayerGuard} from './authguards/player.guard';
import { ScoutGuard } from './authguards/scout.guard';




@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule, 
    MainModule,
    MainRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule
  
  ],
  providers: [PlayerGuard, ScoutGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
