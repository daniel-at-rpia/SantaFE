import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { CoreModule } from 'Core/core.module';
import { HomeModule } from './modules/home/home.module';
import { MarketModule } from 'Market/market.module';
import { TradeModule } from 'Trade/trade.module';
import { DTOService } from './services/DTOService';
import { UtilityService } from './services/UtilityService';
import { GraphService } from './services/GraphService';
import { RestfulCommService } from './services/RestfulCommService';

import { AppRoot } from './app.root';

@NgModule({
  declarations: [
    AppRoot
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,

    // Native modules
    CoreModule,
    HomeModule,
    MarketModule,
    TradeModule
  ],
  providers: [
    DTOService,
    UtilityService,
    GraphService,
    RestfulCommService
  ],
  bootstrap: [AppRoot]
})
export class AppModule { }
