import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { WelcomeModule } from './modules/welcome/welcome.module';
import { HomeModule } from './modules/home/home.module';
import { MarketModule } from './modules/market/market.module';
import { DTOService } from './services/DTOService';
import { UtilityService } from './services/UtilityService';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    WelcomeModule,
    HomeModule,
    MarketModule
  ],
  providers: [
    DTOService,
    UtilityService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
