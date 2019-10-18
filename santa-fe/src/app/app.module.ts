import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { WelcomeModule } from './modules/welcome/welcome.module';
import { HomeModule } from './modules/home/home.module';
import { MarketModule } from './modules/market/market.module';
import { DTOService } from './services/DTOService';
import { UtilityService } from './services/UtilityService';
import { GraphService } from './services/GraphService';
import { RestfulCommService } from './services/RestfulCommService';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,

    // Native modules
    WelcomeModule,
    HomeModule,
    MarketModule
  ],
  providers: [
    DTOService,
    UtilityService,
    GraphService,
    RestfulCommService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
